import { Instagram, Linkedin, Twitter, Github, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo & Copyright */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">MU</span>
            </div>
            <div>
              <h3 className="font-bold">Malick Umar</h3>
              <p className="text-xs text-muted-foreground">© 2024 Malick Umar. All rights reserved.</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-3">
            <a 
              href="https://instagram.com/your_username" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full glass-card hover:scale-110 transition-all duration-300 group"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://linkedin.com/in/your_username" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full glass-card hover:scale-110 transition-all duration-300 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 group-hover:text-accent transition-colors" />
            </a>
            <a 
              href="https://twitter.com/your_username" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full glass-card hover:scale-110 transition-all duration-300 group"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://github.com/your_username" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full glass-card hover:scale-110 transition-all duration-300 group"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 group-hover:text-accent transition-colors" />
            </a>
            <a 
              href="https://youtube.com/your_channel" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full glass-card hover:scale-110 transition-all duration-300 group"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4 group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="mailto:your.email@example.com" 
              className="p-2 rounded-full glass-card hover:scale-110 transition-all duration-300 group"
              aria-label="Email"
            >
              <Mail className="w-4 h-4 group-hover:text-accent transition-colors" />
            </a>
          </div>
        </div>
        
        {/* Bottom Text */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-sm text-muted-foreground">
              Let's Build Something Amazing
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.href = '/admin-login'}
                className="text-xs text-muted-foreground hover:text-primary transition-colors opacity-50 hover:opacity-100"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;