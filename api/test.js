// 测试端点 - 验证 Vercel 函数是否正常工作
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

    const testData = {
      success: true,
      message: 'Vercel 函数正常工作',
      timestamp: new Date().toISOString(),
      method: req.method,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        CREEM_API_KEY: process.env.CREEM_API_KEY ? '已配置' : '未配置',
        CREEM_API_BASE_URL: process.env.CREEM_API_BASE_URL || '未配置'
      }
    };

    console.log('测试端点被调用:', testData);
    
    res.json(testData);
    
  } catch (error) {
    console.error('测试端点错误:', error);
    res.status(500).json({ 
      error: error.message || '测试失败',
      success: false 
    });
  }
};
