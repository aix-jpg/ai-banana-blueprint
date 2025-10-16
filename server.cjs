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
app.use(cors());
app.use(bodyParser.json());

app.post('/api/creem-checkout', async (req, res) => {
  try {
    const { productId, planName, amount, userId, email } = req.body || {};
    
    // 检查是否启用模拟模式
    if (process.env.CREEM_MOCK_MODE === 'true' || !CREEM_API_KEY) {
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
      cancel_url: `${APP_URL}/payment/cancel`,
      metadata: {
        userId,
        planName,
        amount: String(amount ?? ''),
        email
      }
    };

    const resp = await fetch(`${CREEM_API_BASE_URL}/v1/checkout`, {
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
        url: `${CREEM_API_BASE_URL}/v1/checkout`,
        payload: payload,
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
});


