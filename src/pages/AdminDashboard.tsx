import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Eye, EyeOff, Home, Grid } from 'lucide-react';

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
  project_date?: string;
  social_links?: any;
  thumbnail_url?: string;
  show_on_home: boolean;
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

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_featured: boolean;
}

interface Review {
  id: string;
  client_name: string;
  client_image?: string;
  rating: number;
  review_text: string;
  project_type?: string;
  is_featured: boolean;
}

const AdminDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
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
    client_name: '',
    project_date: '',
    social_links: {},
    thumbnail_url: '',
    category_id: '',
    show_on_home: false,
    is_featured: false
  });

  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: 'Monitor',
    is_featured: false
  });

  const [newReview, setNewReview] = useState({
    client_name: '',
    client_image: '',
    rating: 5,
    review_text: '',
    project_type: '',
    is_featured: false
  });

  useEffect(() => {
    checkAdmin();
    fetchData();
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/admin-login';
      return;
    }

    if (user.email !== 'malickirfan00@gmail.com') {
      window.location.href = '/admin-login';
      return;
    }

    setIsAdmin(true);
  };

  const fetchData = async () => {
    await Promise.all([
      fetchProjects(),
      fetchCategories(),
      fetchServices(),
      fetchReviews()
    ]);
    setLoading(false);
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

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive"
      });
    } else {
      setServices(data || []);
    }
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive"
      });
    } else {
      setReviews(data || []);
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

    const { error } = await supabase
      .from('projects')
      .insert([newProject]);

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
      resetNewProject();
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const resetNewProject = () => {
    setNewProject({
      title: '',
      description: '',
      image_url: '',
      demo_url: '',
      code_url: '',
      instagram_url: '',
      youtube_views: 0,
      brand_name: '',
      client_name: '',
      project_date: '',
      social_links: {},
      thumbnail_url: '',
      category_id: '',
      show_on_home: false,
      is_featured: false
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="glass-card border-white/20"
            >
              View Site
            </Button>
            <Button 
              onClick={handleLogout}
              variant="destructive"
            >
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 glass-card border-white/20">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Projects Management</CardTitle>
                  <Button 
                    onClick={() => setShowAddProject(true)}
                    className="glow-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-semibold">{project.title}</h3>
                          <span className="text-xs px-2 py-1 rounded bg-white/20 text-white">
                            {project.project_categories.name}
                          </span>
                          {project.show_on_home && (
                            <div className="relative group">
                              <Home className="w-4 h-4 text-accent" />
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Shows on Home
                              </span>
                            </div>
                          )}
                          {project.is_featured && (
                            <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">{project.description}</p>
                        {project.brand_name && (
                          <p className="text-accent text-sm">Brand: {project.brand_name}</p>
                        )}
                      </div>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Services Management</CardTitle>
                  <Button 
                    onClick={() => setShowAddService(true)}
                    className="glow-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{service.title}</h3>
                        <p className="text-muted-foreground text-sm">{service.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass-card border-white/20"
                          onClick={() => setEditingService(service)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Reviews Management</CardTitle>
                  <Button 
                    onClick={() => setShowAddReview(true)}
                    className="glow-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Review
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{review.client_name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                          ))}
                        </div>
                        <p className="text-muted-foreground text-sm">{review.review_text}</p>
                        {review.project_type && (
                          <p className="text-accent text-sm">Project: {review.project_type}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass-card border-white/20"
                          onClick={() => setEditingReview(review)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Project Dialog */}
        <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
          <DialogContent className="max-w-2xl glass-card border-white/20 max-h-[80vh] overflow-y-auto">
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Image URL"
                  value={newProject.image_url}
                  onChange={(e) => setNewProject({...newProject, image_url: e.target.value})}
                />
                <Input
                  placeholder="Thumbnail URL"
                  value={newProject.thumbnail_url}
                  onChange={(e) => setNewProject({...newProject, thumbnail_url: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <Input
                placeholder="Instagram URL"
                value={newProject.instagram_url}
                onChange={(e) => setNewProject({...newProject, instagram_url: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Brand Name"
                  value={newProject.brand_name}
                  onChange={(e) => setNewProject({...newProject, brand_name: e.target.value})}
                />
                <Input
                  placeholder="Client Name"
                  value={newProject.client_name}
                  onChange={(e) => setNewProject({...newProject, client_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="YouTube Views"
                  value={newProject.youtube_views}
                  onChange={(e) => setNewProject({...newProject, youtube_views: parseInt(e.target.value) || 0})}
                />
                <Input
                  type="date"
                  placeholder="Project Date"
                  value={newProject.project_date}
                  onChange={(e) => setNewProject({...newProject, project_date: e.target.value})}
                />
              </div>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={newProject.show_on_home}
                    onChange={(e) => setNewProject({...newProject, show_on_home: e.target.checked})}
                  />
                  Show on Home Page
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={newProject.is_featured}
                    onChange={(e) => setNewProject({...newProject, is_featured: e.target.checked})}
                  />
                  Featured Project
                </label>
              </div>
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

export default AdminDashboard;