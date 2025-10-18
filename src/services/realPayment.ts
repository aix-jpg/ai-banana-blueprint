/**
 * 真实支付服务 - 尝试调用 Creem API
 * 如果失败，提供友好的错误处理
 */

interface RealPaymentRequest {
  productId: string;
  planName: string;
  amount: number;
  userId: string;
  email: string;
}

interface RealPaymentResponse {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
}

class RealPaymentService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_CREEM_API_KEY || 'creem_test_5lqwP22TPFFQXuY4O5tkX9';
    this.baseUrl = import.meta.env.VITE_CREEM_API_BASE_URL || 'https://test-api.creem.io';
  }

  /**
   * 创建真实支付会话
   */
  async createCheckoutSession(request: RealPaymentRequest): Promise<RealPaymentResponse> {
    try {
      console.log('尝试真实 Creem API 调用:', {
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
        
        // 如果 API 调用失败，返回友好的错误信息
        return {
          success: false,
          error: `支付服务暂时不可用 (${response.status})。请稍后重试或联系客服。`
        };
      }

      const data = await response.json();
      const checkoutUrl = data.checkout_url || data.url;
      
      if (!checkoutUrl) {
        return {
          success: false,
          error: '支付服务返回了无效的响应。请稍后重试。'
        };
      }

      return {
        success: true,
        checkoutUrl,
        sessionId: data.id || data.checkout_id
      };

    } catch (error: any) {
      console.error('真实支付服务错误:', error);
      return {
        success: false,
        error: '网络连接问题。请检查网络连接后重试。'
      };
    }
  }
}

export const realPaymentService = new RealPaymentService();
