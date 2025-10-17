// Vercel API 路由 - Creem Webhook 处理
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
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('CREEM_WEBHOOK_SECRET 未配置');
      return res.status(500).json({ error: 'Webhook secret 未配置' });
    }

    // 这里可以添加 webhook 签名验证逻辑
    // const signature = req.headers['x-webhook-signature'];
    // if (!verifyWebhookSignature(req.body, signature, webhookSecret)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    const { type, data } = req.body;
    
    console.log('收到 Creem webhook:', { type, data });

    // 处理不同类型的 webhook 事件
    switch (type) {
      case 'checkout.completed':
        console.log('支付完成:', data);
        // 这里可以更新用户订阅状态
        break;
      case 'checkout.failed':
        console.log('支付失败:', data);
        break;
      default:
        console.log('未知 webhook 类型:', type);
    }

    return res.json({ success: true });
    
  } catch (e) {
    console.error('Webhook 处理错误:', e);
    return res.status(500).json({ error: e.message || 'Webhook 处理失败' });
  }
};
