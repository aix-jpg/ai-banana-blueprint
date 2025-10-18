/**
 * 定价方案页面
 * 显示免费版、专业版、企业版三种订阅方案
 * 支持用户登录验证和支付跳转
 */

import { useState } from "react";
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { creemClient } from "@/services/creemClient";
import { mockPaymentService } from "@/services/mockPayment";
import { realPaymentService } from "@/services/realPayment";

interface PricingPlan {
  name: string;
  description: string;
  price: number;
  productId: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  buttonVariant?: "default" | "outline";
}

const pricingPlans: PricingPlan[] = [
  {
    name: "免费版",
    description: "个人体验版",
    price: 0,
    productId: "free_starter_monthly",
    features: [
      "每日 10 积分",
      "基础对话功能",
      "标准响应速度"
    ],
    buttonText: "立即使用",
    buttonVariant: "outline"
  },
  {
    name: "专业版",
    description: "个人专业版",
    price: 29,
    productId: "prod_7Wrs8LVI2YGR8YDmFjaNIY",
    features: [
      "每日 100 积分",
      "GPT-4 模型",
      "优先响应速度",
      "邮件支持"
    ],
    buttonText: "开始订阅",
    popular: true
  },
  {
    name: "企业版",
    description: "团队企业版",
    price: 99,
    productId: "prod_6WSrhBXtP4dlRJa6OzrgcV",
    features: [
      "每日 1000 积分",
      "所有模型无限制",
      "API 集成支持",
      "专属客户经理"
    ],
    buttonText: "立即订阅"
  }
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.price === 0) {
      // 免费方案，跳转到主页
      window.location.href = "/";
      return;
    }

    setLoadingPlan(plan.name);

    try {
      // 检查用户是否已登录
      if (!user || !isAuthenticated) {
        toast.error("请先登录后再订阅");
        setLoadingPlan(null);
        return;
      }
      
      console.log('开始支付流程:', {
        productId: plan.productId,
        planName: plan.name,
        amount: plan.price,
        userId: user.id,
        email: user.email
      });

      // 直接跳转到成功页面进行测试
      console.log('直接跳转到成功页面进行测试');
      toast.info("正在处理支付...");
      
      // 构建成功页面 URL
      const successUrl = `${window.location.origin}/payment/success?` +
        `plan=${encodeURIComponent(plan.name)}&` +
        `amount=${plan.price}&` +
        `userId=${user.id}&` +
        `email=${encodeURIComponent(user.email)}&` +
        `mock=true&` +
        `sessionId=test_${Date.now()}`;

      console.log('准备跳转到:', successUrl);
      
      // 直接跳转
      window.location.href = successUrl;
    } catch (error) {
      console.error("支付错误:", error);
      toast.error("支付过程中出现错误，请稍后重试");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            选择订阅方案
          </h1>
          <p className="text-xl text-gray-600">
            简单清晰的定价，选择最适合您的方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular 
                  ? "border-orange-300 shadow-lg scale-105" 
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white px-4 py-1">
                    推荐
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">¥{plan.price}</span>
                  <span className="text-gray-600 ml-1">/月</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? "bg-orange-500 hover:bg-orange-600 text-white" 
                      : ""
                  }`}
                  variant={plan.buttonVariant || "default"}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan === plan.name}
                >
                  {loadingPlan === plan.name ? "处理中..." : plan.buttonText}
                </Button>
                
                {/* 测试按钮 */}
                <Button 
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    console.log('测试跳转按钮被点击');
                    window.location.href = '/payment/success?plan=测试方案&amount=29&mock=true';
                  }}
                >
                  测试跳转
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            所有方案都包含7天免费试用
          </p>
          <p className="text-sm text-gray-500">
            如有问题，请联系客服：support@example.com
          </p>
        </div>
      </div>
    </div>
  );
}
