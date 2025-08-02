import { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const projects = [{
    id: 1,
    title: 'E-commerce Mobile App UI',
    category: 'UI/UX Design',
    date: 'Dec 2024',
    description: 'Modern e-commerce mobile app with intuitive user flow and premium visual design. Features include product browsing, shopping cart, and checkout process.',
    tags: ['Figma', 'Principle', 'After Effects'],
    image: '/api/placeholder/400/300',
    demoUrl: '#',
    codeUrl: '#'
  }, {
    id: 2,
    title: 'E-commerce Fashion Store',
    category: 'Web Development',
    date: 'Dec 2024',
    description: 'Modern fashion e-commerce website with responsive design, product filters, shopping cart, and seamless user experience.',
    tags: ['React', 'Node.js', 'MongoDB', '+1'],
    image: '/api/placeholder/400/300',
    demoUrl: '#',
    codeUrl: '#'
  }, {
    id: 3,
    title: 'Product Launch Campaign',
    category: 'Instagram Reels',
    date: 'Nov 2024',
    description: 'Engaging Instagram reel showcasing new tech product launch with motion graphics and trendy visual effects.',
    tags: ['After Effects', 'Premiere Pro', 'Cinema 4D'],
    image: '/api/placeholder/400/300',
    demoUrl: '#',
    codeUrl: '#'
  }, {
    id: 4,
    title: 'SaaS Dashboard Design',
    category: 'UI/UX Design',
    date: 'Nov 2024',
    description: 'Clean and intuitive dashboard design for a SaaS platform with data visualization and user management features.',
    tags: ['Figma', 'Framer', 'Prototyping'],
    image: '/api/placeholder/400/300',
    demoUrl: '#',
    codeUrl: '#'
  }];
  return <section id="work" className="py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-glow">Featured</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A curated selection of projects that showcase creativity, innovation, and
            results-driven design.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => <Dialog key={project.id}>
              <DialogTrigger asChild>
                <div className="group cursor-pointer" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                  <div className="neu-card overflow-hidden">
                    {/* Project Image */}
                    <div className="relative overflow-hidden">
                      <div className="aspect-video bg-white/5 flex items-center justify-center">
                        <div className="text-6xl opacity-20">🎨</div>
                      </div>
                      
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                          {project.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          📅 {project.date}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, tagIndex) => <span key={tagIndex} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                            {tag}
                          </span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              {/* Project Modal */}
              <DialogContent className="max-w-4xl glass-card border-white/20">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Project Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                    <div className="text-8xl opacity-20">🎨</div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          {project.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          📅 {project.date}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="font-semibold mb-2">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, tagIndex) => <span key={tagIndex} className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">
                            {tag}
                          </span>)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button className="glow-button flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </Button>
                      <Button variant="outline" className="glass-card border-white/20 flex-1">
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>)}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Button 
            className="glow-button"
            onClick={() => window.location.href = '/portfolio'}
          >
            View All Projects
          </Button>
        </div>
      </div>
    </section>;
};
export default Portfolio;