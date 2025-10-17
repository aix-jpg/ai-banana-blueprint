// Vercel API 路由 - Creem 支付处理
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, x-api-key');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { productId, planName, amount, userId, email } = req.body || {};
    
    const APP_URL = process.env.VITE_APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://ai-banana-blueprint.vercel.app';
    const CREEM_API_KEY = process.env.CREEM_API_KEY;
    const CREEM_API_BASE_URL = process.env.CREEM_API_BASE_URL || 'https://api.creem.io';
    
    // 检查是否启用模拟模式
    if (process.env.CREEM_MOCK_MODE === 'true') {
      console.log('使用模拟模式，跳过 Creem API 调用');
      return res.json({ 
        checkoutUrl: 'https://example.com/mock-checkout',
        sessionId: 'mock-session-' + Date.now()
      });
    }
    
    if (!CREEM_API_KEY) {
      return res.status(500).json({ error: 'CREEM_API_KEY 未配置' });
    }
    if (!productId || !userId || !email) {
      return res.status(400).json({ error: '参数缺失: productId/userId/email' });
    }

    const payload = {
      product_id: productId,
      success_url: `${APP_URL}/payment/success`,
      metadata: {
        userId,
        planName,
        amount: String(amount ?? ''),
        email
      }
    };

    // 调用 Creem API
    const url = `${CREEM_API_BASE_URL}/v1/checkouts`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!resp.ok) {
      const text = await resp.text();
      console.error('Creem API 错误详情:', {
        status: resp.status,
        statusText: resp.statusText,
        url,
        payload,
        response: text
      });
      return res.status(500).json({ error: `Creem API 错误 ${resp.status}`, detail: text });
    }
    
    const data = await resp.json();
    const checkoutUrl = data.checkout_url || data.url;
    
    return res.json({ 
      checkoutUrl, 
      sessionId: data.id || data.checkout_id 
    });
    
  } catch (e) {
    console.error('API 错误:', e);
    return res.status(500).json({ error: e.message || '创建支付失败' });
  }
};
