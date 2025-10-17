// Vercel Edge Runtime 版本 - Creem 支付处理
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

    // 获取请求数据
    const { productId, planName, amount, userId, email } = await req.json();
    
    // 检查必要参数
    if (!productId || !userId || !email) {
      return new Response(JSON.stringify({ error: '参数缺失: productId/userId/email' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // 检查环境变量
    const CREEM_API_KEY = process.env.CREEM_API_KEY;
    if (!CREEM_API_KEY) {
      return new Response(JSON.stringify({ error: 'CREEM_API_KEY 未配置' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // 模拟模式检查
    if (process.env.CREEM_MOCK_MODE === 'true') {
      return new Response(JSON.stringify({ 
        checkoutUrl: 'https://example.com/mock-checkout',
        sessionId: 'mock-session-' + Date.now()
      }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // 构建请求数据
    const APP_URL = process.env.VITE_APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://ai-banana-blueprint.vercel.app';
    const CREEM_API_BASE_URL = process.env.CREEM_API_BASE_URL || 'https://api.creem.io';
    
    const payload = {
      product_id: productId,
      success_url: `${APP_URL}/payment/success`,
      metadata: {
        userId,
        planName,
        amount: String(amount || ''),
        email
      }
    };

    // 调用 Creem API
    const response = await fetch(`${CREEM_API_BASE_URL}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Creem API 错误:', response.status, errorText);
      return new Response(JSON.stringify({ 
        error: `Creem API 错误 ${response.status}`, 
        detail: errorText 
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
    console.error('API 错误:', error);
    return new Response(JSON.stringify({ error: error.message || '创建支付失败' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }
}
