// 最简单的支付处理函数
module.exports = (req, res) => {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { productId, userId, email } = req.body || {};
    
    if (!productId || !userId || !email) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // 模拟响应
    res.json({
      checkoutUrl: 'https://example.com/checkout',
      sessionId: 'session-' + Date.now()
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
