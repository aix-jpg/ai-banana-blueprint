interface GenerateContentRequest {
  contents: Array<{
    parts: Array<{
      text?: string;
      inlineData?: {
        mimeType: string;
        data: string;
      };
    }>;
  }>;
}

interface GenerateContentResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

export class ImageGenerationService {
  private apiKey: string;
  private baseUrl = 'https://ai.juguang.chat/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * 文本生成图像
   */
  async generateFromText(prompt: string, aspectRatio: string = '1:1'): Promise<string> {
    // 将比例信息添加到提示词中，使用更明确的指令
    const aspectRatioInstruction = this.getAspectRatioInstruction(aspectRatio);
    const enhancedPrompt = `${prompt}\n\n${aspectRatioInstruction}`;
    
    const requestData: GenerateContentRequest = {
      contents: [{
        parts: [{
          text: enhancedPrompt
        }]
      }]
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const result: GenerateContentResponse = await response.json();
      
      if (result.error) {
        throw new Error(`API错误: ${result.error.message}`);
      }

      if (!result.candidates || result.candidates.length === 0) {
        throw new Error('没有生成内容');
      }

      const candidate = result.candidates[0];
      const parts = candidate.content.parts;

      // 查找图像数据
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          // 返回base64数据URL
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }

      throw new Error('响应中没有找到图像数据');
    } catch (error) {
      console.error('图像生成失败:', error);
      throw error;
    }
  }

  /**
   * 图像生成图像（图生图）
   */
  async generateFromImage(prompt: string, imageFile: File, aspectRatio: string = '1:1'): Promise<string> {
    // 将图像文件转换为base64
    const base64Image = await this.fileToBase64(imageFile);
    
    // 将比例信息添加到提示词中，使用更明确的指令
    const aspectRatioInstruction = this.getAspectRatioInstruction(aspectRatio);
    const enhancedPrompt = `${prompt}\n\n${aspectRatioInstruction}`;
    
    const requestData: GenerateContentRequest = {
      contents: [{
        parts: [
          {
            text: enhancedPrompt
          },
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image
            }
          }
        ]
      }]
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const result: GenerateContentResponse = await response.json();
      
      if (result.error) {
        throw new Error(`API错误: ${result.error.message}`);
      }

      if (!result.candidates || result.candidates.length === 0) {
        throw new Error('没有生成内容');
      }

      const candidate = result.candidates[0];
      const parts = candidate.content.parts;

      // 查找图像数据
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          // 返回base64数据URL
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }

      throw new Error('响应中没有找到图像数据');
    } catch (error) {
      console.error('图像生成失败:', error);
      throw error;
    }
  }

  /**
   * 多图像生成（批量处理）
   */
  async generateFromMultipleImages(prompt: string, imageFiles: File[], aspectRatio: string = '1:1'): Promise<string[]> {
    const results: string[] = [];
    
    // 并行处理多个图像
    const promises = imageFiles.map(file => 
      this.generateFromImage(prompt, file, aspectRatio)
    );
    
    try {
      const generatedImages = await Promise.all(promises);
      return generatedImages;
    } catch (error) {
      console.error('批量图像生成失败:', error);
      throw error;
    }
  }

  /**
   * 获取画面比例指令
   */
  private getAspectRatioInstruction(aspectRatio: string): string {
    const ratioMap: Record<string, string> = {
      '1:1': 'Generate a square image (1:1 aspect ratio). The image should be perfectly square.',
      '9:16': 'Generate a vertical portrait image (9:16 aspect ratio). The image should be tall and narrow, like a phone screen.',
      '3:4': 'Generate a vertical photo image (3:4 aspect ratio). The image should be taller than it is wide.',
      '16:9': 'Generate a horizontal landscape image (16:9 aspect ratio). The image should be wide and short, like a computer screen.',
      '4:3': 'Generate a horizontal classic image (4:3 aspect ratio). The image should be wider than it is tall.',
      '2:3': 'Generate a vertical tall image (2:3 aspect ratio). The image should be very tall and narrow.',
      '21:9': 'Generate an ultra-wide landscape image (21:9 aspect ratio). The image should be very wide and short.',
    };
    
    return ratioMap[aspectRatio] || `Generate an image with aspect ratio ${aspectRatio}.`;
  }

  /**
   * 将文件转换为base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // 移除data:image/...;base64,前缀
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// 创建单例实例
// 使用默认API密钥，环境变量会在构建时注入
const apiKey = import.meta.env.VITE_JUGUANG_API_KEY || 'sk-4upP7eCaoE0crO56WlnEkRekqzXChvlLRxRMWHDX8KXP5XUw';
export const imageGenerationService = new ImageGenerationService(apiKey);
