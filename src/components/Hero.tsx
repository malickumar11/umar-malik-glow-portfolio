import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import profileImage from '@/assets/profile-umar.jpg';

const Hero = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = [
    'UI/UX Designer',
    '3D Creator', 
    'AI Visionary',
    'Digital Innovator'
  ];

  useEffect(() => {
    const speed = isDeleting ? 50 : 100;
    const text = texts[currentIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting && currentText === text) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      } else {
        setCurrentText(prev => 
          isDeleting 
            ? prev.slice(0, -1)
            : text.slice(0, prev.length + 1)
        );
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, currentIndex, isDeleting, texts]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Profile Image */}
        <div className="mb-8 animate-fade-in">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-2xl animate-glow-pulse">
              <img 
                src={profileImage} 
                alt="Umar Malik" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Glow effect behind image */}
            <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-xl -z-10 animate-glow-pulse"></div>
            {/* Sparkle effect */}
            <div className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-bounce">
              ✨
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <span className="text-glow">Hi, I'm </span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Umar
            </span>
          </h1>
        </div>

        {/* Animated Subtitle */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl md:text-4xl font-light text-muted-foreground mb-4">
            I Design Emotions That Sell.
          </h2>
          <div className="text-xl md:text-2xl text-accent-foreground min-h-[2rem]">
            <span className="text-glow-accent">
              {currentText}
              <span className="animate-pulse">|</span>
            </span>
          </div>
        </div>

        {/* Services Tags */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
            <span>UI/UX</span>
            <span>|</span>
            <span>3D Design</span>
            <span>|</span>
            <span>Branding</span>
            <span>|</span>
            <span>Web Development</span>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-center space-x-6">
            <a href="#" className="group p-3 rounded-full glass-card hover:scale-110 transition-all duration-300">
              <Instagram className="w-5 h-5 group-hover:text-primary transition-colors" />
            </a>
            <a href="#" className="group p-3 rounded-full glass-card hover:scale-110 transition-all duration-300">
              <Linkedin className="w-5 h-5 group-hover:text-accent transition-colors" />
            </a>
            <a href="#" className="group p-3 rounded-full glass-card hover:scale-110 transition-all duration-300">
              <Twitter className="w-5 h-5 group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button 
            size="lg" 
            className="glow-button px-8 py-3 text-lg group"
            onClick={() => scrollToSection('work')}
          >
            View Portfolio
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="glass-card border-white/20 px-8 py-3 text-lg"
            onClick={() => scrollToSection('contact')}
          >
            Hire Me
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1 h-3 bg-white/60 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;