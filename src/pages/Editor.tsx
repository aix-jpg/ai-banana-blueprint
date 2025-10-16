import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Sparkles, Coins, Upload, Image as ImageIcon, Star, Download, Home } from "lucide-react";

const Editor = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [credits, setCredits] = useState(5); // 默认给5个积分
  const [mode, setMode] = useState<'text-to-image' | 'image-to-image'>('image-to-image');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isPro, setIsPro] = useState(false);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = isPro ? 9 : 1;
    const maxSize = 50 * 1024 * 1024; // 50MB
    
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

    setUploadedImages(prev => [...prev, ...validFiles].slice(0, maxFiles));
    
    // 创建预览URL
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews].slice(0, maxFiles));
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("请输入提示词");
      return;
    }

    if (mode === 'image-to-image' && uploadedImages.length === 0) {
      toast.error("请上传参考图片");
      return;
    }

    if (credits < 1) {
      toast.error("积分余额不足，请充值或使用兑换码");
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      // 模拟生成过程
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 使用一个示例图片URL
      const sampleImageUrl = "https://picsum.photos/512/512?random=" + Date.now();
      setGeneratedImage(sampleImageUrl);
      setCredits(prev => prev - 1);
      toast.success("图像生成成功！");
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error("图像生成失败");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent mb-2">试用 AI 编辑器</h1>
            <p className="text-lg text-gray-600">体验纳米香魚自然语言图像编辑的强大功能。用简单的文字命令转换任何照片</p>
          </div>
          <div className="flex items-center justify-end gap-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-orange-100 rounded-full">
              <Coins className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-purple-800">{credits} 积分</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Prompt Engine */}
            <Card className="p-6 border-2 border-purple-200 bg-white/90">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-bold text-gray-800">提示引擎</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">使用AI 驱动的编辑功能转换您的图像</p>
              
              {/* Mode Selection */}
              <div className="flex gap-4 mb-6">
                <Button
                  onClick={() => setMode('image-to-image')}
                  className={`flex-1 h-12 ${
                    mode === 'image-to-image' 
                      ? 'bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  图像转图像
                </Button>
                <Button
                  onClick={() => setMode('text-to-image')}
                  className={`flex-1 h-12 ${
                    mode === 'text-to-image' 
                      ? 'bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  文字转图像
                </Button>
              </div>

              {/* Multi-image Processing */}
              <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-4 mb-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">多图片处理</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-purple-600 border-purple-300 hover:bg-purple-50"
                    onClick={() => setIsPro(!isPro)}
                  >
                    {isPro ? '已升级' : '升级'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isPro 
                    ? 'Pro版本已解锁多图片批量处理功能' 
                    : '需要升级 升级到Pro版本解锁多图片批量处理功能'
                  }
                </p>
              </div>

              {/* Reference Image Upload */}
              {mode === 'image-to-image' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">参考图片 {uploadedImages.length}/{isPro ? '9' : '1'}</span>
                  </div>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-gradient-to-r from-purple-50/50 to-orange-50/50">
                    <input
                      type="file"
                      multiple={isPro}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">添加图片</p>
                      <p className="text-xs text-gray-500">每张最大50MB</p>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {isPro 
                      ? 'Pro版本可选择最多9张图片' 
                      : '免费用户限制1张图片,升级Pro版本可选择最多9张图片'
                    }
                  </p>
                  
                  {/* Preview uploaded images */}
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Aspect Ratio */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">画面比例</h3>
                <p className="text-sm text-gray-600 mb-4">测试功能-并不一定保证输出完全符合比例</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '默认', value: '1:1' },
                    { label: '竖屏 9:16', value: '9:16' },
                    { label: '照片 3:4', value: '3:4' },
                    { label: '横屏 16:9', value: '16:9' },
                    { label: '经典 4:3', value: '4:3' },
                    { label: '高瘦 2:3', value: '2:3' }
                  ].map((ratio) => (
                    <Button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      variant={aspectRatio === ratio.value ? "default" : "outline"}
                      className={`h-12 ${
                        aspectRatio === ratio.value 
                          ? 'bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white' 
                          : 'border-purple-300 text-purple-700 hover:bg-purple-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-sm">{ratio.label}</div>
                        <div className="text-xs">{ratio.value}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <Textarea
                  placeholder="描述您想要如何转换图像..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none border-purple-300 focus:border-purple-500"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate} 
                disabled={loading || credits < 1}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    + 购买积分继续生成
                  </>
                )}
              </Button>
              
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-600">消耗积分:1积分</p>
                <p className="text-xs text-gray-500">积分余额不足,请充值或使用兑换码</p>
                <Button variant="link" className="text-purple-600 hover:text-purple-700 p-0 h-auto">
                  点击购买积分包→
                </Button>
              </div>
            </Card>

            {/* Professional Tips */}
            <Card className="p-6 border-2 border-purple-200 bg-white/90">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-bold text-gray-800">专业提示</h3>
              </div>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• 使用简洁的语言提示，如"穿蓝色衣服的女孩"</li>
                <li>• 两次"预想整个世界"的提示会更好</li>
                <li>• 在有明确的背景中保持白色，如书</li>
                <li>• 完美的二次构图，丰富迭代</li>
              </ul>
            </Card>
          </div>

          {/* Right Column - Output Gallery */}
          <div>
            <Card className="p-6 border-2 border-purple-200 bg-white/90 h-full">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-bold text-gray-800">输出画廊</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">您的超快 AI创作将立即显示在这里</p>
              
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300">
                {loading ? (
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">正在生成您的杰作...</p>
                  </div>
                ) : generatedImage ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={generatedImage} 
                      alt="Generated" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <Button 
                      className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedImage;
                        link.download = 'ai-generated-image.png';
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">准备好即时生成</p>
                    <p className="text-sm">输入您的提示并释放力量</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;