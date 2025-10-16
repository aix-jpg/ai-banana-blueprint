# Creem 支付集成配置指南

## 环境变量配置

在项目根目录创建 `.env` 文件，添加以下配置：

```env
# Creem 支付配置
VITE_CREEM_API_KEY=your_creem_api_key_here
VITE_CREEM_API_BASE_URL=https://api.creem.io
VITE_APP_URL=http://localhost:8080

# Supabase 配置
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 其他配置
VITE_PAYMENT_MOCK_MODE=false
```

## 获取 Creem API Key

1. 访问 [Creem Dashboard](https://dashboard.creem.io)
2. 登录你的账户
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 将 API Key 复制到 `VITE_CREEM_API_KEY` 环境变量中

## 产品配置

当前配置的产品ID：

- **免费版**: `free_starter_monthly` (价格: ¥0)
- **专业版**: `prod_7Wrs8LVI2YGR8YDmFjaNIY` (价格: ¥29/月)
- **企业版**: `prod_6WSrhBXtP4dlRJa6OzrgcV` (价格: ¥99/月)

## 支付流程

1. 用户点击订阅按钮
2. 系统调用 `creemService.createCheckoutSession()`
3. 创建 Creem 支付会话
4. 跳转到 Creem 支付页面
5. 用户完成支付后跳转到成功页面

## 测试

### 开发环境测试
1. 设置 `VITE_PAYMENT_MOCK_MODE=true` 使用模拟支付
2. 设置 `VITE_PAYMENT_MOCK_MODE=false` 使用真实 Creem API

### 生产环境
确保所有环境变量正确配置，特别是：
- `VITE_CREEM_API_KEY`: 你的 Creem API Key
- `VITE_APP_URL`: 你的生产环境域名

## 故障排除

### 常见错误

1. **"Creem API Key 未配置"**
   - 检查 `.env` 文件是否存在
   - 确认 `VITE_CREEM_API_KEY` 已设置

2. **"Creem API 错误: 401"**
   - 检查 API Key 是否正确
   - 确认 API Key 有足够权限

3. **"Creem API 错误: 404"**
   - 检查产品ID是否正确
   - 确认产品在 Creem Dashboard 中存在

4. **CORS 错误**
   - 确认 `VITE_APP_URL` 配置正确
   - 检查 Creem Dashboard 中的域名白名单

## 安全注意事项

1. **不要在前端代码中硬编码 API Key**
2. **使用环境变量管理敏感信息**
3. **在生产环境中使用 HTTPS**
4. **定期轮换 API Key**

## 支持

如有问题，请检查：
1. Creem Dashboard 中的 API 使用情况
2. 浏览器控制台的错误信息
3. 网络请求的响应状态
