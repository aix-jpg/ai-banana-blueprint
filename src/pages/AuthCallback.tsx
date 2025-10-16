import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('登录失败，请重试');
          navigate('/');
          return;
        }

        if (data.session) {
          toast.success('登录成功！');
          navigate('/');
        } else {
          toast.error('登录失败，请重试');
          navigate('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('登录失败，请重试');
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">正在处理登录...</h2>
        <p className="text-gray-600">请稍候，我们正在验证您的身份</p>
      </div>
    </div>
  );
};

export default AuthCallback;
