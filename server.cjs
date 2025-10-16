// Lightweight Express backend for Creem checkout and webhook
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 8787;
const APP_URL = process.env.VITE_APP_URL || process.env.NEXT_PUBLIC_APP_URL || `http://localhost:8080`;
const CREEM_API_KEY = process.env.CREEM_API_KEY;
const CREEM_API_BASE_URL = process.env.CREEM_API_BASE_URL || 'https://api.creem.io';
const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET || '';

const app = express();

// 精确的 CORS 配置（允许本地前端）
const allowedOrigins = [
  APP_URL,
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // 同源/服务器端请求
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'x-api-key'],
  credentials: true,
  maxAge: 86400
};
app.use(cors(corsOptions));

// 预检与通用 CORS 响应头（避免使用通配路由导致的 path-to-regexp 报错）
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, x-api-key');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// 确保 JSON 解析
app.use(bodyParser.json());

app.post('/api/creem-checkout', async (req, res) => {
  try {
    const { productId, planName, amount, userId, email } = req.body || {};
    
    // 检查是否启用模拟模式（仅当明确为 true 时）
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

    // 按模板：调用 /v1/checkouts
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
    return res.json({ checkoutUrl, sessionId: data.id || data.checkout_id });
  } catch (e) {
    return res.status(500).json({ error: e.message || '创建支付失败' });
  }
});

// Minimal webhook receiver
app.post('/api/creem-webhook', async (req, res) => {
  try {
    // TODO: 校验签名（根据 Creem 文档）；此处仅记录
    const event = req.body;
    console.log('Creem webhook event:', event?.type);
    // 根据事件类型更新用户订阅（留给集成数据库时实现）
    return res.json({ received: true });
  } catch (e) {
    return res.status(400).json({ error: 'Webhook 处理失败' });
  }
});

app.get('/healthz', (_req, res) => res.send('ok'));

app.listen(PORT, () => {
  console.log(`Creem API server listening on http://localhost:${PORT}`);
  console.log(`APP_URL used for redirects: ${APP_URL}`);
  console.log(`CREEM_API_BASE_URL: ${CREEM_API_BASE_URL}`);
});


