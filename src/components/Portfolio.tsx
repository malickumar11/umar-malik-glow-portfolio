import { useState, useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  demo_url?: string;
  code_url?: string;
  instagram_url?: string;
  youtube_views?: number;
  brand_name?: string;
  client_name?: string;
  is_featured: boolean;
  show_on_home: boolean;
  category_id: string;
  created_at: string;
  project_categories: {
    name: string;
    slug: string;
  };
}

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeProjects();
  }, []);

  const fetchHomeProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories (
          name,
          slug
        )
      `)
      .eq('show_on_home', true)
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section id="work" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="text-white">Loading projects...</div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="work" className="py-20">
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
        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Dialog key={project.id}>
                <DialogTrigger asChild>
                  <div className="group cursor-pointer" style={{
                    animationDelay: `${index * 0.1}s`
                  }}>
                    <div className="neu-card overflow-hidden">
                      {/* Project Image */}
                      <div className="relative overflow-hidden">
                        <div className="aspect-video bg-white/5 flex items-center justify-center">
                          {project.image_url ? (
                            <img 
                              src={project.image_url} 
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <div className="text-6xl opacity-20">
                              {project.project_categories?.slug === 'instagram-reels' ? '🎬' : 
                               project.project_categories?.slug === 'graphic-design' ? '🎨' : '💻'}
                            </div>
                          )}
                          {/* Fallback icon when image fails to load */}
                          <div className="fallback-icon text-6xl opacity-20 hidden items-center justify-center absolute inset-0 bg-white/5">
                            {project.project_categories?.slug === 'instagram-reels' ? '🎬' : 
                             project.project_categories?.slug === 'graphic-design' ? '🎨' : '💻'}
                          </div>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                            {project.project_categories.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            📅 {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {project.brand_name && (
                          <p className="text-sm text-accent mb-4">
                            Brand: {project.brand_name}
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {project.demo_url && (
                            <Button size="sm" className="glow-button flex-1">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Demo
                            </Button>
                          )}
                          {project.code_url && (
                            <Button size="sm" variant="outline" className="glass-card border-white/20 flex-1">
                              <Github className="w-3 h-3 mr-1" />
                              Code
                            </Button>
                          )}
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
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="text-8xl opacity-20">
                          {project.project_categories.slug === 'instagram-reels' ? '🎬' : 
                           project.project_categories.slug === 'graphic-design' ? '🎨' : '💻'}
                        </div>
                      )}
                    </div>

                    {/* Project Details */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                            {project.project_categories.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            📅 {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>
                        {project.brand_name && (
                          <p className="text-accent mt-2">
                            Brand: {project.brand_name}
                          </p>
                        )}
                        {project.client_name && (
                          <p className="text-muted-foreground mt-1">
                            Client: {project.client_name}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        {project.demo_url && (
                          <Button className="glow-button flex-1">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </Button>
                        )}
                        {project.code_url && (
                          <Button variant="outline" className="glass-card border-white/20 flex-1">
                            <Github className="w-4 h-4 mr-2" />
                            View Code
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured projects available.</p>
          </div>
        )}

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
    </section>
  );
};
export default Portfolio;