import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Sparkles, LogOut, Home, Coins } from "lucide-react";
import { User } from "@supabase/supabase-js";

const Editor = () => {
  const [user, setUser] = useState<User | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("default");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchCredits(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      } else if (session) {
        setUser(session.user);
        fetchCredits(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      setCredits(data.credits);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (credits < 1) {
      toast.error("Insufficient credits");
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, aspectRatio }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedImage(data.imageUrl);
      setCredits(data.remainingCredits);
      toast.success("Image generated successfully!");
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">AI Image Editor</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <Coins className="w-4 h-4 text-primary" />
              <span className="font-semibold">{credits} Credits</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <Home className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Image Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Describe your image
                  </label>
                  <Textarea
                    placeholder="A beautiful sunset over mountains..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Aspect Ratio
                  </label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Square (1:1)</SelectItem>
                      <SelectItem value="9:16">Vertical (9:16)</SelectItem>
                      <SelectItem value="3:4">Photo (3:4)</SelectItem>
                      <SelectItem value="16:9">Horizontal (16:9)</SelectItem>
                      <SelectItem value="4:3">Classic (4:3)</SelectItem>
                      <SelectItem value="2:3">Tall (2:3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={loading || credits < 1}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Image (1 Credit)
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-primary/5">
              <h3 className="font-semibold mb-2">💡 Tips for better results</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Be specific and descriptive</li>
                <li>• Include details about style, colors, and mood</li>
                <li>• Mention the subject clearly</li>
                <li>• Add lighting and atmosphere details</li>
              </ul>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Generated Image</h2>
              
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {loading ? (
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Creating your masterpiece...</p>
                  </div>
                ) : generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your generated image will appear here</p>
                  </div>
                )}
              </div>

              {generatedImage && !loading && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = 'ai-generated-image.png';
                    link.click();
                  }}
                >
                  Download Image
                </Button>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;