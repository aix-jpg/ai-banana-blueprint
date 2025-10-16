import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles, Zap, Shapes, Lock, ArrowRight, Star, Loader2, Coins, Upload, Image as ImageIcon, Download, Copy, Workflow, RefreshCw, Heart, Trash2, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LoginModal } from "@/components/LoginModal";
import { CreditsModal } from "@/components/CreditsModal";
import { useAuth } from "@/hooks/useAuth";
import { imageGenerationService } from "@/services/imageGeneration";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, signOut } = useAuth();
  
  // 编辑器相关状态
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [credits, setCredits] = useState(5);
  const [mode, setMode] = useState<'text-to-image' | 'image-to-image'>('image-to-image');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  type PricingPlan = {
    name: string;
    description: string;
    price: number;
    productId: string;
    features: string[];
    buttonText: string;
    popular?: boolean;
    buttonVariant?: "default" | "outline";
  };

  const pricingPlans: PricingPlan[] = [
    {
      name: "免费版",
      description: "个人体验版",
      price: 0,
      productId: "free_starter_monthly",
      features: ["每日 10 积分", "基础对话功能", "标准响应速度"],
      buttonText: "立即使用",
      buttonVariant: "outline"
    },
    {
      name: "专业版",
      description: "个人专业版",
      price: 29,
      productId: "prod_51OxGxDi3NHPZ6HK33XUTi",
      features: ["每日 100 积分", "GPT-4 模型", "优先响应速度", "邮件支持"],
      buttonText: "开始订阅",
      popular: true
    },
    {
      name: "企业版",
      description: "团队企业版",
      price: 99,
      productId: "prod_20S2vnsK1gbbRn1s7Vqize",
      features: ["每日 1000 积分", "所有模型无限制", "API 集成支持", "专属客户经理"],
      buttonText: "立即订阅"
    }
  ];

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.price === 0) {
      navigate("/editor");
      return;
    }
    setLoadingPlan(plan.name);
    try {
      if (!user || !isAuthenticated) {
        setShowLoginModal(true);
        setLoadingPlan(null);
        return;
      }

      const res = await fetch((import.meta.env.VITE_API_BASE_URL || "http://localhost:8787") + "/api/creem-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: plan.productId,
          planName: plan.name,
          amount: plan.price,
          userId: user.id,
          email: user.email
        })
      });

      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "创建支付失败");
      }
      window.location.href = data.checkoutUrl;
    } catch (e: any) {
      console.error("支付错误:", e);
      toast.error(e.message || "支付过程中出现错误");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleGetStarted = () => {
    // 如果未登录，直接弹出积分不足页面引导付费
    if (!isAuthenticated) {
      setShowCreditsModal(true);
      return;
    }
    
    // 滚动到编辑器部分
    document.getElementById('ai-editor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = isPro ? 9 : 1;
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    // 首先检查是否已经达到限制
    if (uploadedImages.length >= maxFiles) {
      if (!isPro) {
        toast.error("免费用户限制1张图片，请升级到Pro版本");
        // 触发升级弹窗
        setIsPro(true); // 这里可以改为显示升级弹窗
      } else {
        toast.error(`已达到最大上传限制 ${maxFiles} 张图片`);
      }
      return;
    }
    
    if (files.length > maxFiles) {
      toast.error(`最多可上传 ${maxFiles} 张图片`);
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`文件 ${file.name} 超过 50MB 限制`);
        return false;
      }
      return true;
    });

    // 检查是否超过限制
    if (uploadedImages.length + validFiles.length > maxFiles) {
      toast.error(`最多只能上传 ${maxFiles} 张图片`);
      return;
    }

    setUploadedImages(prev => [...prev, ...validFiles].slice(0, maxFiles));
    
    // 创建预览URL
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews].slice(0, maxFiles));
    
    // 如果用户尝试上传多张图片但不是Pro用户，显示升级提示
    if (files.length > 1 && !isPro) {
      toast.info("💡 升级到Pro版本可同时上传多张图片进行批量处理");
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleGenerate = async () => {
    // 如果未登录，直接弹出积分不足弹窗
    if (!isAuthenticated) {
      setShowCreditsModal(true);
      return;
    }

    if (!prompt.trim()) {
      toast.error("请输入提示词");
      return;
    }

    if (mode === 'image-to-image' && uploadedImages.length === 0) {
      toast.error("请上传参考图片");
      return;
    }

    // 只有登录用户才检查积分
    if (isAuthenticated && credits < 1) {
      setShowCreditsModal(true);
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      let generatedImageUrl: string;

      if (mode === 'text-to-image') {
        // 文生图模式
        generatedImageUrl = await imageGenerationService.generateFromText(prompt, aspectRatio);
      } else {
        // 图生图模式
        if (uploadedImages.length === 1) {
          // 单图处理
          generatedImageUrl = await imageGenerationService.generateFromImage(prompt, uploadedImages[0], aspectRatio);
        } else {
          // 多图处理（取第一张图片）
          generatedImageUrl = await imageGenerationService.generateFromImage(prompt, uploadedImages[0], aspectRatio);
        }
      }

      setGeneratedImage(generatedImageUrl);
      setCredits(prev => prev - 1);
      toast.success("图像生成成功！");
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(error.message || "图像生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{t('header.title')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {user?.email}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={signOut}
                  className="text-gray-600 hover:text-gray-800"
                >
                  退出
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                className="text-gray-600"
                onClick={() => setShowLoginModal(true)}
              >
                {t('header.signIn')}
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => navigate('/pricing')}
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
            >
              {t('header.pricing')}
            </Button>
            <Button 
              onClick={handleGetStarted}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {t('header.getStarted')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            {t('hero.badge')}
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('hero.title')}{" "}
            <span className="text-purple-600">AI Magic</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
            >
              {t('hero.startCreating')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gray-300 text-gray-700 px-8 py-4 text-lg"
            >
              {t('hero.learnMore')}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Star className="w-4 h-4 text-purple-500" />
            <span>{t('hero.freeCredits')}</span>
          </div>
        </div>
      </section>

      {/* AI Editor Section */}
      <section id="ai-editor" className="py-20 bg-gradient-to-br from-purple-50 via-white to-orange-50">
        <div className="container mx-auto px-4">

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-6">
              {/* Prompt Engine */}
              <Card className="p-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{t('editor.promptEngine.title')}</h3>
                    <p className="text-sm text-gray-500">{t('editor.promptEngine.subtitle')}</p>
                  </div>
                </div>
                
                {/* Mode Selection */}
                <div className="flex gap-3 mb-8">
                  <Button
                    onClick={() => setMode('image-to-image')}
                    className={`flex-1 h-14 rounded-xl font-semibold transition-all duration-300 ${
                      mode === 'image-to-image' 
                        ? 'bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white shadow-lg transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent hover:border-purple-200'
                    }`}
                  >
                    <ImageIcon className="w-5 h-5 mr-3" />
                    {t('editor.promptEngine.imageToImage')}
                  </Button>
                  <Button
                    onClick={() => setMode('text-to-image')}
                    className={`flex-1 h-14 rounded-xl font-semibold transition-all duration-300 ${
                      mode === 'text-to-image' 
                        ? 'bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white shadow-lg transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent hover:border-purple-200'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 mr-3" />
                    {t('editor.promptEngine.textToImage')}
                  </Button>
                </div>

                {/* Multi-image Processing */}
                <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl p-6 mb-8 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-700">{t('editor.promptEngine.multiImage.title')}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={`rounded-lg font-medium transition-all duration-300 ${
                        isPro 
                          ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' 
                          : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
                      }`}
                      onClick={() => setIsPro(!isPro)}
                    >
                      {isPro ? t('editor.promptEngine.multiImage.upgraded') : t('editor.promptEngine.multiImage.upgrade')}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isPro 
                      ? t('editor.promptEngine.multiImage.proDescription') 
                      : t('editor.promptEngine.multiImage.description')
                    }
                  </p>
                </div>

                {/* Reference Image Upload */}
                {mode === 'image-to-image' && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-semibold text-gray-700">{t('editor.promptEngine.referenceImage.title')}</span>
                        <span className="text-sm text-gray-500">({uploadedImages.length}/{isPro ? '9' : '1'})</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 max-w-[700px]">
                      {/* 已上传图片的缩略图 */}
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-[200px] object-cover rounded-lg border-2 border-purple-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      
                      {/* 上传区域 - 只有在未达到限制时才显示 */}
                      {uploadedImages.length < (isPro ? 9 : 1) && (
                        <div className="w-full h-[200px]">
                          <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center bg-orange-50/50 hover:bg-orange-100/50 transition-all duration-300 h-full flex flex-col items-center justify-center">
                            <input
                              type="file"
                              multiple={true}
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer block w-full h-full flex flex-col items-center justify-center">
                              <Upload className="w-10 h-10 text-orange-500 mb-3" />
                              <p className="text-sm text-gray-600 font-medium">{t('editor.promptEngine.referenceImage.upload')}</p>
                              <p className="text-xs text-gray-500 mt-1">{t('editor.promptEngine.referenceImage.maxSize')}</p>
                            </label>
                          </div>
                        </div>
                      )}
                      
                      {/* 达到限制时的提示 */}
                      {uploadedImages.length >= (isPro ? 9 : 1) && !isPro && (
                        <div className="w-full h-[200px]">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 h-full flex flex-col items-center justify-center">
                            <Lock className="w-10 h-10 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-500 text-center font-medium">已达上限</p>
                            <p className="text-xs text-gray-400 text-center mt-1">升级Pro解锁更多</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-3">
                      {isPro 
                        ? t('editor.promptEngine.referenceImage.proLimit') 
                        : t('editor.promptEngine.referenceImage.freeLimit')
                      }
                    </p>
                  </div>
                )}

                {/* Aspect Ratio */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Shapes className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{t('editor.promptEngine.aspectRatio.title')}</h4>
                      <p className="text-sm text-gray-500">{t('editor.promptEngine.aspectRatio.subtitle')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: t('editor.promptEngine.aspectRatio.default'), value: '1:1', icon: '⬜' },
                      { label: t('editor.promptEngine.aspectRatio.portrait'), value: '9:16', icon: '📱' },
                      { label: t('editor.promptEngine.aspectRatio.photo'), value: '3:4', icon: '📸' },
                      { label: t('editor.promptEngine.aspectRatio.landscape'), value: '16:9', icon: '🖥️' },
                      { label: t('editor.promptEngine.aspectRatio.classic'), value: '4:3', icon: '📺' },
                      { label: t('editor.promptEngine.aspectRatio.tall'), value: '2:3', icon: '📄' }
                    ].map((ratio) => (
                      <Button
                        key={ratio.value}
                        onClick={() => setAspectRatio(ratio.value)}
                        variant={aspectRatio === ratio.value ? "default" : "outline"}
                        className={`h-16 rounded-xl transition-all duration-300 ${
                          aspectRatio === ratio.value 
                            ? 'bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white shadow-lg transform scale-105' 
                            : 'border-purple-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-lg mb-1">{ratio.icon}</div>
                          <div className="font-semibold text-sm">{ratio.label}</div>
                          <div className="text-xs opacity-75">{ratio.value}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Prompt Input */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{t('editor.promptEngine.prompt.title')}</h4>
                      <p className="text-sm text-gray-500">{t('editor.promptEngine.prompt.subtitle')}</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder={t('editor.promptEngine.prompt.placeholder')}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="resize-none border-2 border-purple-200 focus:border-purple-400 rounded-xl text-lg p-4 transition-all duration-300"
                  />
                </div>

                {/* Generate Button */}
                <div className="space-y-4">
                  <Button 
                    onClick={handleGenerate} 
                    disabled={loading || credits < 1}
                    className="w-full h-16 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        {t('editor.promptEngine.generate.creating')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 mr-3" />
                        {t('editor.promptEngine.generate.start')}
                      </>
                    )}
                  </Button>
                  
                </div>
              </Card>

            </div>

            {/* Right Column - Output Gallery */}
            <div>
              <Card className="p-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{t('editor.output.title')}</h3>
                    <p className="text-sm text-gray-500">{t('editor.output.subtitle')}</p>
                  </div>
                </div>
                
                <div className="aspect-square bg-gradient-to-br from-purple-100 via-white to-orange-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-purple-300 hover:border-purple-400 transition-all duration-300">
                  {loading ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader2 className="w-10 h-10 animate-spin text-white" />
                      </div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">{t('editor.output.generating')}</p>
                      <p className="text-sm text-gray-500">{t('editor.output.generatingDescription')}</p>
                    </div>
                  ) : generatedImage ? (
                    <div className="w-full h-full relative group">
                      <img 
                        src={generatedImage} 
                        alt="Generated" 
                        className="w-full h-full object-contain rounded-2xl"
                      />
                      
                      {/* 左侧分辨率选择按钮 */}
                      <div className="absolute left-4 top-4 flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white text-gray-800">
                          原
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white text-gray-800">
                          2x
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white text-gray-800">
                          4x
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white text-gray-800">
                          8x
                        </Button>
                      </div>
                      
                      {/* 底部功能按钮 */}
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                        <Button 
                          size="sm"
                          className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = generatedImage;
                            link.download = 'ai-generated-image.png';
                            link.click();
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          下载
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedImage);
                            toast.success('链接已复制到剪贴板');
                          }}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          复制链接
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                        >
                          <Workflow className="w-4 h-4 mr-1" />
                          工作流
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                          onClick={handleGenerate}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          重新生成
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          ☆推荐
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-white/90 hover:bg-white text-red-600 shadow-lg"
                          onClick={() => {
                            setGeneratedImage(null);
                            toast.success('图像已删除');
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          删除
                        </Button>
                      </div>
                      
                      {/* 提示词显示 */}
                      <div className="absolute bottom-16 left-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm">
                        <div className="font-medium mb-1">生成提示词:</div>
                        <div className="text-xs opacity-90">{prompt}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date().toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ImageIcon className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-xl font-semibold text-gray-700 mb-2">{t('editor.output.ready')}</p>
                      <p className="text-sm text-gray-500">{t('editor.output.readyDescription')}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">选择订阅方案</h2>
          <p className="text-center text-gray-600 mb-12">简单清晰的定价，随时升级，随时取消</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-orange-300 shadow-lg scale-105" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-4 py-1">推荐</Badge>
                  </div>
                )}

                <div className="text-center pb-4 pt-6">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>

                <div className="px-6">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-gray-900">¥{plan.price}</span>
                    <span className="text-gray-600 ml-1">/月</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
                    variant={plan.buttonVariant || "default"}
                    onClick={() => handleSubscribe(plan)}
                    disabled={loadingPlan === plan.name}
                  >
                    {loadingPlan === plan.name ? "处理中..." : plan.buttonText}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">所有方案都包含7天免费试用</p>
            <Button variant="outline" onClick={() => navigate('/pricing')}>查看更多方案</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('features.lightning.title')}</h3>
              <p className="text-gray-600">
                {t('features.lightning.description')}
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shapes className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('features.formats.title')}</h3>
              <p className="text-gray-600">
                {t('features.formats.description')}
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('features.secure.title')}</h3>
              <p className="text-gray-600">
                {t('features.secure.description')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            {t('howItWorks.title')}
          </h2>
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('howItWorks.step1.title')}</h3>
                <p className="text-gray-600">
                  {t('howItWorks.step1.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('howItWorks.step2.title')}</h3>
                <p className="text-gray-600">
                  {t('howItWorks.step2.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('howItWorks.step3.title')}</h3>
                <p className="text-gray-600">
                  {t('howItWorks.step3.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      {/* Credits Modal */}
      <CreditsModal 
        isOpen={showCreditsModal} 
        onClose={() => setShowCreditsModal(false)}
        currentCredits={isAuthenticated ? credits : 0}
        requiredCredits={1}
      />
      
    </div>
  );
};

export default Landing;
