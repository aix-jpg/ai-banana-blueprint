// 调试页面 - 检查环境变量和配置
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { creemClient } from '@/services/creemClient';

export default function DebugPage() {
  const [testResult, setTestResult] = useState<any>(null);

  const checkEnvironment = () => {
    const env = {
      VITE_CREEM_API_KEY: import.meta.env.VITE_CREEM_API_KEY,
      VITE_CREEM_API_BASE_URL: import.meta.env.VITE_CREEM_API_BASE_URL,
      VITE_APP_URL: import.meta.env.VITE_APP_URL,
      NODE_ENV: import.meta.env.NODE_ENV,
      MODE: import.meta.env.MODE,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV
    };
    
    console.log('环境变量:', env);
    return env;
  };

  const testCreemAPI = async () => {
    try {
      const result = await creemClient.createCheckoutSession({
        productId: 'test-product',
        planName: 'Test Plan',
        amount: 29.99,
        userId: 'test-user',
        email: 'test@example.com'
      });
      
      setTestResult(result);
      console.log('Creem API 测试结果:', result);
    } catch (error) {
      setTestResult({ error: error.message });
      console.error('Creem API 测试错误:', error);
    }
  };

  const env = checkEnvironment();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">调试页面</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>环境变量</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(env, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Creem API 测试</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={testCreemAPI} className="mb-4">
                测试 Creem API
              </Button>
              
              {testResult && (
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
