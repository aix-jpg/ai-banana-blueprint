// 最基础的测试端点
module.exports = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    const result = {
      success: true,
      message: '函数正常工作',
      timestamp: new Date().toISOString(),
      method: req.method
    };

    console.log('测试成功:', result);
    res.json(result);
    
  } catch (error) {
    console.error('测试失败:', error);
    res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
};
