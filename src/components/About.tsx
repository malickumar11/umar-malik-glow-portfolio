import { Monitor, Film, Palette, Code } from 'lucide-react';

const About = () => {
  const services = [
    {
      icon: Monitor,
      title: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user experiences that convert visitors into customers.'
    },
    {
      icon: Film,
      title: 'Video Editing',
      description: 'Professional video editing, including color grading, motion graphics, and storytelling.'
    },
    {
      icon: Palette,
      title: 'Graphic Design',
      description: 'Visual communication through typography, photography, and illustration, including thumbnail design.'
    },
    {
      icon: Code,
      title: 'Web Development',
      description: 'Building fast, responsive websites with modern technologies and best practices.'
    }
  ];

  const stats = [
    { number: '3+', label: 'Years of Experience' },
    { number: '50+', label: 'Projects Completed' }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-glow">Crafting Digital</span>
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I'm a creative founder passionate about transforming ideas into 
                  compelling digital experiences. With expertise spanning UI/UX design, 
                  editing, graphic design, and development, I help businesses create 
                  emotional connections with their audiences through thoughtful design.
                </p>
                <p>
                  Every project is an opportunity to solve problems creatively, tell 
                  meaningful stories, and build something that not only looks amazing but 
                  also drives real results.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-glow-accent mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="neu-card p-6 group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 p-3 rounded-xl bg-white/10 w-fit group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;