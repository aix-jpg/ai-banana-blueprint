// Vercel API 路由 - Creem 支付处理
const https = require('https');

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

    // 使用 Node.js 内置的 https 模块调用 Creem API
    const url = new URL(`${CREEM_API_BASE_URL}/v1/checkouts`);
    const postData = JSON.stringify(payload);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const result = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });
      
      req.on('error', (e) => {
        reject(e);
      });
      
      req.write(postData);
      req.end();
    });
    
    const checkoutUrl = result.checkout_url || result.url;
    if (!checkoutUrl) {
      throw new Error('Creem API 未返回 checkout_url');
    }
    
    return res.json({ 
      checkoutUrl, 
      sessionId: result.id || result.checkout_id 
    });
    
  } catch (e) {
    console.error('API 错误:', e);
    return res.status(500).json({ error: e.message || '创建支付失败' });
  }
};
