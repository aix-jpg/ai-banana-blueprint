/**
 * 支付服务
 * 处理支付相关的API调用
 */

interface PaymentRequest {
  productId: string;
  planName: string;
  amount: number;
  userId: string;
  email: string;
}

interface PaymentResponse {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
}

class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';
  }

  /**
   * 创建支付会话
   */
  async createCheckoutSession(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // 模拟支付流程 - 实际项目中应该调用真实的支付API
      if (import.meta.env.VITE_PAYMENT_MOCK_MODE === 'true') {
        // Mock模式 - 直接返回成功页面URL
        const mockUrl = `${window.location.origin}/payment/success?` +
          `plan=${encodeURIComponent(request.planName)}&amount=${request.amount}&mock=true`;
        
        return {
          success: true,
          checkoutUrl: mockUrl,
          sessionId: `mock_${Date.now()}`
        };
      }

      // 真实支付API调用
      const response = await fetch(`${this.baseUrl}/api/creem-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "创建支付失败");
      }

      return {
        success: true,
        checkoutUrl: data.checkoutUrl,
        sessionId: data.sessionId
      };

    } catch (error: any) {
      console.error("支付服务错误:", error);
      return {
        success: false,
        error: error.message || "支付服务异常"
      };
    }
  }

  /**
   * 验证支付状态
   */
  async verifyPayment(sessionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      return data.success || false;

    } catch (error) {
      console.error("验证支付状态失败:", error);
      return false;
    }
  }

  /**
   * 获取用户订阅信息
   */
  async getUserSubscription(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/user-subscription`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      const data = await response.json();
      return data;

    } catch (error) {
      console.error("获取订阅信息失败:", error);
      return null;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
