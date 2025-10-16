/**
 * Creem 支付服务
 * 直接调用 Creem API 进行支付处理
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

class CreemService {
  private apiKey: string;
  private baseUrl: string;
  private appUrl: string;

  constructor() {
    // 从环境变量获取配置
    this.apiKey = import.meta.env.VITE_CREEM_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_CREEM_API_BASE_URL || 'https://api.creem.io';
    this.appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    
    if (!this.apiKey) {
      console.warn('Creem API Key 未配置，请设置 VITE_CREEM_API_KEY 环境变量');
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
        success_url: `${this.appUrl}/payment/success`,
        cancel_url: `${this.appUrl}/payment/cancel`,
        metadata: {
          userId: request.userId,
          planName: request.planName,
          amount: request.amount.toString(),
          billingCycle: 'monthly',
          email: request.email
        }
      };

      const response = await fetch(`${this.baseUrl}/v1/checkout`, {
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

  /**
   * 验证支付状态
   */
  async verifyPayment(sessionId: string): Promise<boolean> {
    try {
      if (!this.apiKey) {
        return false;
      }

      const response = await fetch(`${this.baseUrl}/v1/checkout/${sessionId}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.status === 'completed' || data.status === 'paid';
    } catch (error) {
      console.error('验证支付状态失败:', error);
      return false;
    }
  }
}

export const creemService = new CreemService();
export default creemService;
