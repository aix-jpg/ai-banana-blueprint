// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">AI Image Studio</span>
          </div>
          <div className="flex gap-3">
            <a href="/auth">
              <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Sign In
              </button>
            </a>
            <a href="/auth">
              <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Get Started
              </button>
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Content */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-medium">AI-Powered Image Generation</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Create Stunning Images with
            <span className="block text-primary mt-2">AI Magic</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into beautiful images in seconds. No design skills needed.
            Just describe what you want, and watch AI bring it to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href="/auth">
              <button className="px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
                Start Creating Free
              </button>
            </a>
            <a href="#features">
              <button className="px-8 py-4 text-lg font-semibold border-2 border-border rounded-lg hover:bg-accent transition-colors">
                Learn More
              </button>
            </a>
          </div>

          <div className="pt-8 text-sm text-muted-foreground">
            ✨ Get 5 free credits when you sign up • No credit card required
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-32">
          <div className="text-center space-y-4 p-6 rounded-xl hover:bg-accent/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground">Generate high-quality images in seconds with our advanced AI</p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-xl hover:bg-accent/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Multiple Formats</h3>
            <p className="text-muted-foreground">Choose from various aspect ratios for any use case</p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-xl hover:bg-accent/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Secure & Private</h3>
            <p className="text-muted-foreground">Your creations are private and secure with enterprise-grade protection</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mt-32">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="space-y-12">
            <div className="flex gap-8 items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Describe Your Vision</h3>
                <p className="text-muted-foreground">Simply type what you want to create in natural language</p>
              </div>
            </div>

            <div className="flex gap-8 items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Format</h3>
                <p className="text-muted-foreground">Select the perfect aspect ratio for your needs</p>
              </div>
            </div>

            <div className="flex gap-8 items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Your Image</h3>
                <p className="text-muted-foreground">Download high-quality images instantly</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-32 py-16 px-4 bg-primary/5 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators using AI to bring their ideas to life
          </p>
          <a href="/auth">
            <button className="px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
              Get Started with 5 Free Credits
            </button>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t">
        <div className="text-center text-muted-foreground">
          <p>© 2025 AI Image Studio. Powered by advanced AI technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
