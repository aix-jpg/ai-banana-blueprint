// Vercel Edge Function - Creem API 代理
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    // 设置 CORS 头
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, x-api-key',
    });
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers });
    }
    
    // 只允许 POST 请求
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    const { productId, planName, amount, userId, email } = await req.json();
    
    // 检查必要参数
    if (!productId || !userId || !email) {
      return new Response(JSON.stringify({ error: '参数缺失: productId/userId/email' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // 获取环境变量
    const CREEM_API_KEY = process.env.CREEM_API_KEY || 'creem_test_5lqwP22TPFFQXuY4O5tkX9';
    const CREEM_API_BASE_URL = process.env.CREEM_API_BASE_URL || 'https://test-api.creem.io';
    const APP_URL = process.env.VITE_APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://ai-banana-blueprint.vercel.app';

    // 构建请求数据
    const payload = {
      product_id: productId,
      success_url: `${APP_URL}/payment/success`,
      cancel_url: `${APP_URL}/payment/cancel`,
      metadata: {
        userId,
        planName,
        amount: String(amount || ''),
        email
      }
    };

    console.log('Edge Function 调用 Creem API:', {
      url: `${CREEM_API_BASE_URL}/v1/checkouts`,
      hasApiKey: !!CREEM_API_KEY
    });

    // 调用 Creem API
    const response = await fetch(`${CREEM_API_BASE_URL}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Banana-Blueprint-Edge/1.0'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Creem API 响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Creem API 错误:', response.status, response.statusText, errorText);
      return new Response(JSON.stringify({ 
        error: `Creem API 错误 ${response.status}`, 
        detail: errorText,
        status: response.status
      }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    const checkoutUrl = data.checkout_url || data.url;
    
    if (!checkoutUrl) {
      return new Response(JSON.stringify({ error: 'Creem API 未返回 checkout_url' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      checkoutUrl, 
      sessionId: data.id || data.checkout_id 
    }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Edge Function 错误:', error);
    return new Response(JSON.stringify({ error: error.message || 'Edge Function 执行失败' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }
}
