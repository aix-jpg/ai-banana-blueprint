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

      // 根据产品 ID 生成不同的模拟 URL
      let mockCheckoutUrl: string;
      
      switch (request.productId) {
        case 'prod_7Wrs8LVI2YGR8YDmFjaNIY': // 专业版
          mockCheckoutUrl = `https://checkout.stripe.com/pay/cs_test_pro_${Date.now()}`;
          break;
        case 'prod_6WSrhBXtP4dlRJa6OzrgcV': // 企业版
          mockCheckoutUrl = `https://checkout.stripe.com/pay/cs_test_enterprise_${Date.now()}`;
          break;
        default:
          mockCheckoutUrl = `https://checkout.stripe.com/pay/cs_test_${Date.now()}`;
      }

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
