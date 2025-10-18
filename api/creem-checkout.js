// Creem 支付处理 - 稳定版本
const https = require('https');

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

    const { productId, planName, amount, userId, email } = req.body || {};
    
    // 检查必要参数
    if (!productId || !userId || !email) {
      res.status(400).json({ error: '参数缺失: productId/userId/email' });
      return;
    }

    // 获取环境变量
    const CREEM_API_KEY = process.env.CREEM_API_KEY;
    const CREEM_API_BASE_URL = process.env.CREEM_API_BASE_URL || 'https://api.creem.io';
    const APP_URL = process.env.VITE_APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://ai-banana-blueprint.vercel.app';

    if (!CREEM_API_KEY) {
      res.status(500).json({ error: 'CREEM_API_KEY 未配置' });
      return;
    }

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

    console.log('调用 Creem API:', {
      url: `${CREEM_API_BASE_URL}/v1/checkouts`,
      payload,
      hasApiKey: !!CREEM_API_KEY
    });

    // 使用 Node.js 内置的 https 模块
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
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'AI-Banana-Blueprint/1.0'
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
      res.status(500).json({ error: 'Creem API 未返回 checkout_url' });
      return;
    }
    
    res.json({ 
      checkoutUrl, 
      sessionId: result.id || result.checkout_id 
    });
    
  } catch (error) {
    console.error('Creem API 错误:', error);
    res.status(500).json({ error: error.message || '创建支付失败' });
  }
};
