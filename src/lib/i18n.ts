export type Language = 'en' | 'zh' | 'vi';

export interface Translations {
  // Header
  header: {
    title: string;
    signIn: string;
    getStarted: string;
    pricing: string;
  };
  
  // Hero Section
  hero: {
    badge: string;
    title: string;
    description: string;
    startCreating: string;
    learnMore: string;
    freeCredits: string;
  };
  
  // AI Editor
  editor: {
    promptEngine: {
      title: string;
      subtitle: string;
      imageToImage: string;
      textToImage: string;
      multiImage: {
        title: string;
        upgrade: string;
        upgraded: string;
        description: string;
        proDescription: string;
      };
      referenceImage: {
        title: string;
        upload: string;
        maxSize: string;
        freeLimit: string;
        proLimit: string;
      };
      aspectRatio: {
        title: string;
        subtitle: string;
        default: string;
        portrait: string;
        photo: string;
        landscape: string;
        classic: string;
        tall: string;
      };
      prompt: {
        title: string;
        subtitle: string;
        placeholder: string;
      };
      generate: {
        creating: string;
        start: string;
      };
    };
    output: {
      title: string;
      subtitle: string;
      ready: string;
      readyDescription: string;
      generating: string;
      generatingDescription: string;
      download: string;
    };
  };
  
  // Features
  features: {
    lightning: {
      title: string;
      description: string;
    };
    formats: {
      title: string;
      description: string;
    };
    secure: {
      title: string;
      description: string;
    };
  };
  
  // How It Works
  howItWorks: {
    title: string;
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
    };
    step3: {
      title: string;
      description: string;
    };
  };
  
  // Footer
  footer: {
    copyright: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: 'AI Image Studio',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      pricing: 'Pricing'
    },
    hero: {
      badge: 'AI-Powered Image Generation',
      title: 'Create Stunning Images with',
      description: 'Transform your ideas into beautiful images in seconds. No design skills needed. Just describe what you want, and watch AI bring it to life.',
      startCreating: 'Start Creating Free',
      learnMore: 'Learn More',
      freeCredits: 'Get 5 free credits when you sign up • No credit card required'
    },
    editor: {
      promptEngine: {
        title: 'Prompt Engine',
        subtitle: 'AI-powered image transformation',
        imageToImage: 'Image to Image',
        textToImage: 'Text to Image',
        multiImage: {
          title: 'Multi-Image Processing',
          upgrade: 'Upgrade to Pro',
          upgraded: '✓ Upgraded',
          description: '💡 Upgrade to Pro to unlock multi-image batch processing',
          proDescription: '🎉 Pro version unlocked multi-image batch processing'
        },
        referenceImage: {
          title: 'Reference Images',
          upload: 'Add Images',
          maxSize: 'Max 50MB each',
          freeLimit: '💡 Free users limited to 1 image, upgrade to Pro for up to 9 images',
          proLimit: '🎉 Pro version allows up to 9 images'
        },
        aspectRatio: {
          title: 'Aspect Ratio',
          subtitle: 'Choose the perfect output ratio',
          default: 'Default',
          portrait: 'Portrait',
          photo: 'Photo',
          landscape: 'Landscape',
          classic: 'Classic',
          tall: 'Tall'
        },
        prompt: {
          title: 'Creative Description',
          subtitle: 'Describe your desired effect in natural language',
          placeholder: 'e.g., Convert this photo to watercolor style, maintaining the original composition...'
        },
        generate: {
          creating: 'Creating your masterpiece...',
          start: '✨ Start Creating'
        }
      },
      output: {
        title: 'Output Gallery',
        subtitle: 'Your ultra-fast AI creations will appear here instantly',
        ready: '✨ Ready for instant generation',
        readyDescription: 'Enter your prompt and unleash AI\'s creative power',
        generating: '🎨 Creating your masterpiece...',
        generatingDescription: 'Please wait, AI is creating for you',
        download: 'Download Image'
      }
    },
    features: {
      lightning: {
        title: 'Lightning Fast',
        description: 'Generate high-quality images in seconds with our advanced AI'
      },
      formats: {
        title: 'Multiple Formats',
        description: 'Choose from various aspect ratios for any use case'
      },
      secure: {
        title: 'Secure & Private',
        description: 'Your creations are private and secure with enterprise-grade protection'
      }
    },
    howItWorks: {
      title: 'How It Works',
      step1: {
        title: 'Describe Your Vision',
        description: 'Simply type what you want to create in natural language'
      },
      step2: {
        title: 'Choose Your Format',
        description: 'Select the perfect aspect ratio for your needs'
      },
      step3: {
        title: 'Get Your Image',
        description: 'Download high-quality images instantly'
      }
    },
    footer: {
      copyright: '© 2025 AI Image Studio. Powered by advanced AI technology.'
    }
  },
  zh: {
    header: {
      title: 'AI 图像工作室',
      signIn: '登录',
      getStarted: '开始使用',
      pricing: '价格'
    },
    hero: {
      badge: 'AI 驱动的图像生成',
      title: '用',
      description: '几秒钟内将您的想法转化为精美图像。无需设计技能。只需描述您想要的内容，AI 就能为您实现。',
      startCreating: '免费开始创作',
      learnMore: '了解更多',
      freeCredits: '注册即送 5 个免费积分 • 无需信用卡'
    },
    editor: {
      promptEngine: {
        title: '提示引擎',
        subtitle: 'AI 驱动的图像转换功能',
        imageToImage: '图像转图像',
        textToImage: '文字转图像',
        multiImage: {
          title: '多图片处理',
          upgrade: '升级到 Pro',
          upgraded: '✓ 已升级',
          description: '💡 升级到Pro版本解锁多图片批量处理功能',
          proDescription: '🎉 Pro版本已解锁多图片批量处理功能'
        },
        referenceImage: {
          title: '参考图片',
          upload: '添加图片',
          maxSize: '每张最大50MB',
          freeLimit: '💡 免费用户限制1张图片，升级Pro版本可选择最多9张图片',
          proLimit: '🎉 Pro版本可选择最多9张图片'
        },
        aspectRatio: {
          title: '画面比例',
          subtitle: '选择最适合的输出比例',
          default: '默认',
          portrait: '竖屏',
          photo: '照片',
          landscape: '横屏',
          classic: '经典',
          tall: '高瘦'
        },
        prompt: {
          title: '创意描述',
          subtitle: '用自然语言描述您想要的效果',
          placeholder: '例如：将这张照片转换为水彩画风格，保持原有的构图...'
        },
        generate: {
          creating: '正在生成您的杰作...',
          start: '✨ 开始创作'
        }
      },
      output: {
        title: '输出画廊',
        subtitle: '您的超快 AI创作将立即显示在这里',
        ready: '✨ 准备好即时生成',
        readyDescription: '输入您的提示并释放AI的创作力量',
        generating: '🎨 正在生成您的杰作...',
        generatingDescription: '请稍候，AI正在为您创作',
        download: '下载图片'
      }
    },
    features: {
      lightning: {
        title: '闪电般快速',
        description: '使用我们先进的 AI 技术，几秒钟内生成高质量图像'
      },
      formats: {
        title: '多种格式',
        description: '为任何用途选择各种宽高比'
      },
      secure: {
        title: '安全私密',
        description: '您的创作受到企业级保护，私密且安全'
      }
    },
    howItWorks: {
      title: '使用流程',
      step1: {
        title: '描述您的愿景',
        description: '用自然语言简单描述您想要创建的内容'
      },
      step2: {
        title: '选择您的格式',
        description: '为您的需求选择完美的宽高比'
      },
      step3: {
        title: '获取您的图像',
        description: '立即下载高质量图像'
      }
    },
    footer: {
      copyright: '© 2025 AI 图像工作室。由先进 AI 技术驱动。'
    }
  },
  vi: {
    header: {
      title: 'Studio Hình Ảnh AI',
      signIn: 'Đăng Nhập',
      getStarted: 'Bắt Đầu',
      pricing: 'Giá Cả'
    },
    hero: {
      badge: 'Tạo Hình Ảnh Bằng AI',
      title: 'Tạo Hình Ảnh Tuyệt Đẹp Với',
      description: 'Biến ý tưởng của bạn thành hình ảnh đẹp trong vài giây. Không cần kỹ năng thiết kế. Chỉ cần mô tả những gì bạn muốn, và xem AI biến nó thành hiện thực.',
      startCreating: 'Bắt Đầu Tạo Miễn Phí',
      learnMore: 'Tìm Hiểu Thêm',
      freeCredits: 'Nhận 5 tín dụng miễn phí khi đăng ký • Không cần thẻ tín dụng'
    },
    editor: {
      promptEngine: {
        title: 'Công Cụ Gợi Ý',
        subtitle: 'Chức năng chuyển đổi hình ảnh bằng AI',
        imageToImage: 'Hình Ảnh Sang Hình Ảnh',
        textToImage: 'Văn Bản Sang Hình Ảnh',
        multiImage: {
          title: 'Xử Lý Nhiều Hình Ảnh',
          upgrade: 'Nâng Cấp Pro',
          upgraded: '✓ Đã Nâng Cấp',
          description: '💡 Nâng cấp lên Pro để mở khóa xử lý hàng loạt nhiều hình ảnh',
          proDescription: '🎉 Phiên bản Pro đã mở khóa xử lý hàng loạt nhiều hình ảnh'
        },
        referenceImage: {
          title: 'Hình Ảnh Tham Khảo',
          upload: 'Thêm Hình Ảnh',
          maxSize: 'Tối đa 50MB mỗi hình',
          freeLimit: '💡 Người dùng miễn phí giới hạn 1 hình, nâng cấp Pro để chọn tối đa 9 hình',
          proLimit: '🎉 Phiên bản Pro cho phép chọn tối đa 9 hình'
        },
        aspectRatio: {
          title: 'Tỷ Lệ Khung Hình',
          subtitle: 'Chọn tỷ lệ đầu ra hoàn hảo',
          default: 'Mặc Định',
          portrait: 'Dọc',
          photo: 'Ảnh',
          landscape: 'Ngang',
          classic: 'Cổ Điển',
          tall: 'Cao'
        },
        prompt: {
          title: 'Mô Tả Sáng Tạo',
          subtitle: 'Mô tả hiệu ứng mong muốn bằng ngôn ngữ tự nhiên',
          placeholder: 'Ví dụ: Chuyển đổi bức ảnh này sang phong cách màu nước, giữ nguyên bố cục gốc...'
        },
        generate: {
          creating: 'Đang tạo kiệt tác của bạn...',
          start: '✨ Bắt Đầu Tạo'
        }
      },
      output: {
        title: 'Thư Viện Đầu Ra',
        subtitle: 'Các tác phẩm AI siêu nhanh của bạn sẽ xuất hiện ngay lập tức',
        ready: '✨ Sẵn sàng tạo tức thì',
        readyDescription: 'Nhập gợi ý của bạn và giải phóng sức mạnh sáng tạo của AI',
        generating: '🎨 Đang tạo kiệt tác của bạn...',
        generatingDescription: 'Vui lòng chờ, AI đang tạo cho bạn',
        download: 'Tải Hình Ảnh'
      }
    },
    features: {
      lightning: {
        title: 'Nhanh Như Chớp',
        description: 'Tạo hình ảnh chất lượng cao trong vài giây với AI tiên tiến của chúng tôi'
      },
      formats: {
        title: 'Nhiều Định Dạng',
        description: 'Chọn từ nhiều tỷ lệ khung hình cho mọi trường hợp sử dụng'
      },
      secure: {
        title: 'Bảo Mật & Riêng Tư',
        description: 'Tác phẩm của bạn được bảo mật và riêng tư với bảo vệ cấp doanh nghiệp'
      }
    },
    howItWorks: {
      title: 'Cách Hoạt Động',
      step1: {
        title: 'Mô Tả Tầm Nhìn',
        description: 'Chỉ cần gõ những gì bạn muốn tạo bằng ngôn ngữ tự nhiên'
      },
      step2: {
        title: 'Chọn Định Dạng',
        description: 'Chọn tỷ lệ khung hình hoàn hảo cho nhu cầu của bạn'
      },
      step3: {
        title: 'Nhận Hình Ảnh',
        description: 'Tải xuống hình ảnh chất lượng cao ngay lập tức'
      }
    },
    footer: {
      copyright: '© 2025 Studio Hình Ảnh AI. Được hỗ trợ bởi công nghệ AI tiên tiến.'
    }
  }
};

export const defaultLanguage: Language = 'en';

export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};
