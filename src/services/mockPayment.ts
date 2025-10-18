/**
 * 模拟支付服务 - 完全静态解决方案
 * 避免 Vercel 函数崩溃问题
 */

interface MockPaymentRequest {
  productId: string;
  planName: string;
  amount: number;
  userId: string;
  email: string;
}

interface MockPaymentResponse {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
}

class MockPaymentService {
  /**
   * 创建模拟支付会话
   */
  async createCheckoutSession(request: MockPaymentRequest): Promise<MockPaymentResponse> {
    try {
      console.log('模拟支付流程:', {
        productId: request.productId,
        planName: request.planName,
        amount: request.amount,
        userId: request.userId,
        email: request.email
      });

      // 模拟支付处理延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成模拟支付成功页面 URL
      const mockCheckoutUrl = `${window.location.origin}/payment/success?` +
        `plan=${encodeURIComponent(request.planName)}&` +
        `amount=${request.amount}&` +
        `userId=${request.userId}&` +
        `email=${encodeURIComponent(request.email)}&` +
        `mock=true&` +
        `sessionId=mock_${Date.now()}`;

      return {
        success: true,
        checkoutUrl: mockCheckoutUrl,
        sessionId: `mock_session_${Date.now()}`
      };

    } catch (error: any) {
      console.error('模拟支付错误:', error);
      return {
        success: false,
        error: error.message || '模拟支付服务异常'
      };
    }
  }
}

export const mockPaymentService = new MockPaymentService();
