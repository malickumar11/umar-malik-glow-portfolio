import { useState, useEffect } from 'react';
import { ExternalLink, Github, Instagram, Trash2, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  is_featured: boolean;
  category_id: string;
  created_at: string;
  project_categories: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image_url: '',
    demo_url: '',
    code_url: '',
    instagram_url: '',
    youtube_views: 0,
    brand_name: '',
    category_id: '',
    is_featured: false
  });

  useEffect(() => {
    fetchProjects();
    fetchCategories();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      setIsAdmin(profile?.role === 'admin');
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories (
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive"
      });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('project_categories')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    } else {
      setCategories(data || []);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.category_id) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    // Clean up the project data before sending
    const projectData = {
      ...newProject,
      demo_url: newProject.demo_url || null,
      code_url: newProject.code_url || null,
      instagram_url: newProject.instagram_url || null,
      brand_name: newProject.brand_name || null,
      image_url: newProject.image_url || null,
      youtube_views: newProject.youtube_views || null
    };

    const { error } = await supabase
      .from('projects')
      .insert([projectData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Project added successfully"
      });
      setShowAddProject(false);
      setNewProject({
        title: '',
        description: '',
        image_url: '',
        demo_url: '',
        code_url: '',
        instagram_url: '',
        youtube_views: 0,
        brand_name: '',
        category_id: '',
        is_featured: false
      });
      fetchProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Project deleted successfully"
      });
      fetchProjects();
    }
  };

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.project_categories.slug === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            <span className="text-glow">All Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my complete portfolio of creative work and innovative solutions.
          </p>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-8 flex justify-center">
            <Button 
              onClick={() => setShowAddProject(true)}
              className="glow-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
          <TabsList className="grid w-full grid-cols-4 glass-card border-white/20">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="website-development">Website Development</TabsTrigger>
            <TabsTrigger value="graphic-design">Graphic Design</TabsTrigger>
            <TabsTrigger value="instagram-reels">Instagram Reels</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="neu-card overflow-hidden group">
                  <div className="relative">
                    {/* Project Image */}
                    <div className="aspect-video bg-white/5 flex items-center justify-center">
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl opacity-20">
                          {project.project_categories.slug === 'instagram-reels' ? '🎬' : 
                           project.project_categories.slug === 'graphic-design' ? '🎨' : '💻'}
                        </div>
                      )}
                    </div>

                    {/* Admin Controls */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="glass-card border-white/20"
                            onClick={() => setEditingProject(project)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                        {project.project_categories.name}
                      </span>
                      {project.is_featured && (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
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

                    {project.youtube_views && (
                      <p className="text-sm text-muted-foreground mb-4">
                        👁️ {project.youtube_views.toLocaleString()} views
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
                      {project.instagram_url && (
                        <Button size="sm" variant="outline" className="glass-card border-white/20 flex-1">
                          <Instagram className="w-3 h-3 mr-1" />
                          Reel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Project Modal */}
        <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
          <DialogContent className="max-w-2xl glass-card border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
              />
              <Textarea
                placeholder="Description"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
              <Select 
                value={newProject.category_id}
                onValueChange={(value) => setNewProject({...newProject, category_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Image URL"
                value={newProject.image_url}
                onChange={(e) => setNewProject({...newProject, image_url: e.target.value})}
              />
              <Input
                placeholder="Demo URL"
                value={newProject.demo_url}
                onChange={(e) => setNewProject({...newProject, demo_url: e.target.value})}
              />
              <Input
                placeholder="Code URL"
                value={newProject.code_url}
                onChange={(e) => setNewProject({...newProject, code_url: e.target.value})}
              />
              <Input
                placeholder="Instagram URL"
                value={newProject.instagram_url}
                onChange={(e) => setNewProject({...newProject, instagram_url: e.target.value})}
              />
              <Input
                placeholder="Brand Name"
                value={newProject.brand_name}
                onChange={(e) => setNewProject({...newProject, brand_name: e.target.value})}
              />
              <Input
                type="number"
                placeholder="YouTube Views"
                value={newProject.youtube_views}
                onChange={(e) => setNewProject({...newProject, youtube_views: parseInt(e.target.value) || 0})}
              />
              <div className="flex gap-4">
                <Button onClick={handleAddProject} className="glow-button flex-1">
                  Add Project
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddProject(false)}
                  className="glass-card border-white/20 flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Portfolio;