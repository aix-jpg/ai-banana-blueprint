// Vercel API 路由 - Creem 支付处理 (最简化版本)
module.exports = async (req, res) => {
  try {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, x-api-key');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // 只允许 POST 请求
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    // 获取请求数据
    const { productId, planName, amount, userId, email } = req.body || {};
    
    // 检查必要参数
    if (!productId || !userId || !email) {
      res.status(400).json({ error: '参数缺失: productId/userId/email' });
      return;
    }

    // 检查环境变量
    const CREEM_API_KEY = process.env.CREEM_API_KEY;
    if (!CREEM_API_KEY) {
      res.status(500).json({ error: 'CREEM_API_KEY 未配置' });
      return;
    }

    // 模拟模式检查
    if (process.env.CREEM_MOCK_MODE === 'true') {
      res.json({ 
        checkoutUrl: 'https://example.com/mock-checkout',
        sessionId: 'mock-session-' + Date.now()
      });
      return;
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
      res.status(500).json({ 
        error: `Creem API 错误 ${response.status}`, 
        detail: errorText 
      });
      return;
    }
    
    const data = await response.json();
    const checkoutUrl = data.checkout_url || data.url;
    
    if (!checkoutUrl) {
      res.status(500).json({ error: 'Creem API 未返回 checkout_url' });
      return;
    }
    
    res.json({ 
      checkoutUrl, 
      sessionId: data.id || data.checkout_id 
    });
    
  } catch (error) {
    console.error('API 错误:', error);
    res.status(500).json({ error: error.message || '创建支付失败' });
  }
};
