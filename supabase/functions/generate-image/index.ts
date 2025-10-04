import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, aspectRatio } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Check user credits
    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (creditsError || !creditsData || creditsData.credits < 1) {
      return new Response(
        JSON.stringify({ error: 'Insufficient credits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate image dimensions based on aspect ratio
    let width = 1024;
    let height = 1024;
    
    switch (aspectRatio) {
      case '9:16': // vertical
        width = 720;
        height = 1280;
        break;
      case '3:4': // photo
        width = 768;
        height = 1024;
        break;
      case '16:9': // horizontal
        width = 1280;
        height = 720;
        break;
      case '4:3': // classic
        width = 1024;
        height = 768;
        break;
      case '2:3': // tall
        width = 832;
        height = 1216;
        break;
    }

    // Generate image using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating image with prompt:', prompt);
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: `Generate a high-quality image: ${prompt}. Image should be ${width}x${height} pixels.`
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API error:', error);
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    console.log('AI response received');
    
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      throw new Error('No image generated');
    }

    // Create generation record
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        prompt,
        aspect_ratio: aspectRatio || 'default',
        image_url: imageUrl,
        status: 'completed'
      })
      .select()
      .single();

    if (genError) {
      console.error('Error creating generation record:', genError);
    }

    // Deduct credit
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: creditsData.credits - 1 })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        generationId: generation?.id,
        remainingCredits: creditsData.credits - 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-image function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});