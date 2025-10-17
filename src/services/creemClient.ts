/**
 * 客户端 Creem 支付服务
 * 直接在前端调用 Creem API，避免 Vercel 函数崩溃问题
 */

interface CreemCheckoutRequest {
  productId: string;
  planName: string;
  amount: number;
  userId: string;
  email: string;
}

interface CreemCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
}

class CreemClientService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // 从环境变量获取配置，添加备用配置
    this.apiKey = import.meta.env.VITE_CREEM_API_KEY || 'creem_test_5lqwP22TPFFQXuY4O5tkX9';
    this.baseUrl = import.meta.env.VITE_CREEM_API_BASE_URL || 'https://test-api.creem.io';
    
    console.log('Creem 客户端配置:', {
      hasApiKey: !!this.apiKey,
      baseUrl: this.baseUrl,
      env: import.meta.env.MODE,
      isProduction: import.meta.env.PROD
    });
    
    if (!this.apiKey) {
      console.warn('Creem API Key 未配置，使用默认测试 Key');
    }
  }

  /**
   * 创建支付会话
   */
  async createCheckoutSession(request: CreemCheckoutRequest): Promise<CreemCheckoutResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Creem API Key 未配置');
      }

      console.log('调用 Creem API:', {
        productId: request.productId,
        planName: request.planName,
        amount: request.amount
      });

      const checkoutData = {
        product_id: request.productId,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
        metadata: {
          userId: request.userId,
          planName: request.planName,
          amount: request.amount.toString(),
          billingCycle: 'monthly',
          email: request.email
        }
      };

      const response = await fetch(`${this.baseUrl}/v1/checkouts`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Creem API 错误:', response.status, response.statusText, errorText);
        throw new Error(`Creem API 错误: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('Creem API 响应:', data);

      const checkoutUrl = data.checkout_url || data.url;
      if (!checkoutUrl) {
        throw new Error('Creem API 未返回 checkout_url');
      }

      return {
        success: true,
        checkoutUrl,
        sessionId: data.id || data.checkout_id
      };

    } catch (error: any) {
      console.error('Creem 支付错误:', error);
      return {
        success: false,
        error: error.message || 'Creem 支付服务异常'
      };
    }
  }
}

export const creemClient = new CreemClientService();
