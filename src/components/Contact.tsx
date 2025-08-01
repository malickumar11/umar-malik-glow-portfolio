import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageCircle, Send, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent! 🚀",
        description: "Thanks for reaching out. I'll get back to you soon!",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Me',
      description: 'umar@malickumar.com',
      action: 'mailto:umar@malickumar.com'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Quick response guaranteed',
      action: '#'
    }
  ];

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-glow">Let's Build Something</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to bring your vision to life? Let's discuss your project and create
            something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Whether you have a project in mind, need design consultation, or just want to say hello, 
                I'd love to hear from you. Let's create something incredible together.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <a 
                  key={index}
                  href={method.action}
                  className="block p-6 neu-card group cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-white/10 group-hover:scale-110 transition-transform duration-300">
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {method.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                <a href="#" className="p-3 rounded-full glass-card hover:scale-110 transition-all duration-300 group">
                  <Instagram className="w-5 h-5 group-hover:text-primary transition-colors" />
                </a>
                <a href="#" className="p-3 rounded-full glass-card hover:scale-110 transition-all duration-300 group">
                  <Linkedin className="w-5 h-5 group-hover:text-accent transition-colors" />
                </a>
                <a href="#" className="p-3 rounded-full glass-card hover:scale-110 transition-all duration-300 group">
                  <Twitter className="w-5 h-5 group-hover:text-primary transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="glass-card border-white/20 bg-transparent"
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="glass-card border-white/20 bg-transparent"
                  />
                </div>
              </div>
              
              <div>
                <Input
                  name="subject"
                  placeholder="Project Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="glass-card border-white/20 bg-transparent"
                />
              </div>
              
              <div>
                <Textarea
                  name="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="glass-card border-white/20 bg-transparent resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full glow-button py-3 text-lg group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;