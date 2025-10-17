// 测试端点 - 验证 Vercel 函数是否正常工作
module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, x-api-key');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const testData = {
      message: 'Vercel 函数正常工作',
      timestamp: new Date().toISOString(),
      method: req.method,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV
      }
    };

    console.log('测试端点被调用:', testData);
    
    return res.json({
      success: true,
      data: testData
    });
    
  } catch (e) {
    console.error('测试端点错误:', e);
    return res.status(500).json({ 
      error: e.message || '测试失败',
      stack: e.stack 
    });
  }
};
