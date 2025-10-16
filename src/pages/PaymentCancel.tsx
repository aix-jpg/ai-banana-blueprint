/**
 * 支付取消页面
 * 显示支付取消信息和重新选择方案选项
 */

import { useEffect, useState } from "react";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

export default function PaymentCancel() {
  const [sessionId, setSessionId] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    // 从URL参数获取会话ID
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("session_id") || urlParams.get("checkout_id") || "";
    setSessionId(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-700 mb-2">
              支付已取消
            </h1>
            <p className="text-muted-foreground">
              您已取消支付流程，没有产生任何费用。
            </p>
          </div>

          {sessionId && (
            <div className="bg-muted rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">取消详情</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>会话ID:</span>
                  <span className="font-medium text-xs">
                    {sessionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>状态:</span>
                  <span className="font-medium text-red-600">已取消</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              className="w-full group"
              onClick={() => (window.location.href = "/pricing")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              重新选择方案
            </Button>
            <Button
              variant="outline"
              className="w-full group"
              onClick={() => (window.location.href = "/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            如有问题，请联系客服或稍后重试。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
