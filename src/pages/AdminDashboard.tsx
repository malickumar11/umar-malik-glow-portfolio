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
import { Plus, Edit, Trash2, Eye, EyeOff, Home, Grid, Upload, X } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  demo_url?: string;
  code_url?: string;
  project_url?: string;
  instagram_url?: string;
  youtube_views?: number;
  brand_name?: string;
  client_name?: string;
  project_date?: string;
  social_date?: string;
  social_links?: Record<string, any>;
  thumbnail_url?: string;
  images?: string[];
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
    project_url: '',
    instagram_url: '',
    youtube_views: 0,
    brand_name: '',
    client_name: '',
    project_date: '',
    social_date: '',
    social_links: {},
    thumbnail_url: '',
    category_id: '',
    images: [] as string[],
    show_on_home: false,
    is_featured: false
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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
      setProjects((data || []).map(project => ({
        ...project,
        social_links: (typeof project.social_links === 'object' && project.social_links !== null) ? project.social_links : {},
        images: Array.isArray(project.images) ? project.images.map(String) : []
      })) as Project[]);
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

    // Clean up the project data before sending
    const projectData = {
      ...newProject,
      project_date: newProject.project_date || null,
      social_date: newProject.social_date || null,
      youtube_views: newProject.youtube_views || null,
      demo_url: newProject.demo_url || null,
      code_url: newProject.code_url || null,
      instagram_url: newProject.instagram_url || null,
      brand_name: newProject.brand_name || null,
      client_name: newProject.client_name || null,
      thumbnail_url: newProject.thumbnail_url || null,
      image_url: newProject.image_url || null
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

  const handleUpdateProject = async () => {
    if (!editingProject || !editingProject.title || !editingProject.category_id) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    // Clean up the project data before sending
    const projectData = {
      ...editingProject,
      project_date: editingProject.project_date || null,
      social_date: editingProject.social_date || null,
      youtube_views: editingProject.youtube_views || null,
      demo_url: editingProject.demo_url || null,
      code_url: editingProject.code_url || null,
      instagram_url: editingProject.instagram_url || null,
      brand_name: editingProject.brand_name || null,
      client_name: editingProject.client_name || null,
      thumbnail_url: editingProject.thumbnail_url || null,
      image_url: editingProject.image_url || null
    };

    const { error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', editingProject.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Project updated successfully"
      });
      setEditingProject(null);
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
      project_url: '',
      instagram_url: '',
      youtube_views: 0,
      brand_name: '',
      client_name: '',
      project_date: '',
      social_date: '',
      social_links: {},
      thumbnail_url: '',
      category_id: '',
      images: [],
      show_on_home: false,
      is_featured: false
    });
    setSelectedCategory(null);
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setUploadingImages(true);
    const uploadedUrls: string[] = [];
    
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      setNewProject({
        ...newProject,
        images: [...newProject.images, ...uploadedUrls]
      });

      toast({
        title: "Success",
        description: `${uploadedUrls.length} image(s) uploaded successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    setUploadingImages(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `thumbnail_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setNewProject({
        ...newProject,
        thumbnail_url: data.publicUrl
      });

      toast({
        title: "Success",
        description: "Thumbnail uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload thumbnail",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setNewProject({
      ...newProject,
      images: newProject.images.filter((_, index) => index !== indexToRemove)
    });
  };

  const getCategorySpecificFields = () => {
    if (!selectedCategory) return null;

    const commonSocialFields = (
      <div className="space-y-4">
        <h4 className="text-white font-semibold">Social Media Links</h4>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Instagram URL"
            value={newProject.instagram_url}
            onChange={(e) => setNewProject({...newProject, instagram_url: e.target.value})}
          />
          <Input
            placeholder="YouTube Views"
            type="number"
            value={newProject.youtube_views}
            onChange={(e) => setNewProject({...newProject, youtube_views: parseInt(e.target.value) || 0})}
          />
        </div>
        <Input
          type="datetime-local"
          placeholder="Social Date"
          value={newProject.social_date}
          onChange={(e) => setNewProject({...newProject, social_date: e.target.value})}
        />
      </div>
    );

    switch (selectedCategory.slug) {
      case 'graphic-design':
        return (
          <div className="space-y-4">
            {commonSocialFields}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Client Name"
                value={newProject.client_name}
                onChange={(e) => setNewProject({...newProject, client_name: e.target.value})}
              />
              <Input
                placeholder="Brand Name"
                value={newProject.brand_name}
                onChange={(e) => setNewProject({...newProject, brand_name: e.target.value})}
              />
            </div>
          </div>
        );
      
          case 'website-development':
        return (
          <div className="space-y-4">
            {commonSocialFields}
            <div className="grid grid-cols-3 gap-4">
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
                placeholder="Project URL"
                value={newProject.project_url}
                onChange={(e) => setNewProject({...newProject, project_url: e.target.value})}
              />
            </div>
            <Input
              placeholder="Client Name"
              value={newProject.client_name}
              onChange={(e) => setNewProject({...newProject, client_name: e.target.value})}
            />
          </div>
        );
      
      case 'video-editing':
        return (
          <div className="space-y-4">
            {commonSocialFields}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Client Name"
                value={newProject.client_name}
                onChange={(e) => setNewProject({...newProject, client_name: e.target.value})}
              />
              <Input
                placeholder="Video Duration (minutes)"
                type="number"
                value={(newProject.social_links as any)?.duration || ''}
                onChange={(e) => setNewProject({
                  ...newProject, 
                  social_links: { ...newProject.social_links, duration: e.target.value }
                })}
              />
            </div>
          </div>
        );
      
      default:
        return commonSocialFields;
    }
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
          <DialogContent className="max-w-4xl glass-card border-white/20 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Step 1: Category Selection */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Step 1: Select Category</h3>
                <Select 
                  value={newProject.category_id}
                  onValueChange={(value) => {
                    const category = categories.find(c => c.id === value);
                    setNewProject({...newProject, category_id: value});
                    setSelectedCategory(category || null);
                  }}
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
              </div>

              {/* Step 2: Basic Information */}
              {selectedCategory && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Step 2: Basic Information</h3>
                  <Input
                    placeholder="Project Title *"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                  <Input
                    type="date"
                    placeholder="Project Date"
                    value={newProject.project_date}
                    onChange={(e) => setNewProject({...newProject, project_date: e.target.value})}
                  />
                </div>
              )}

              {/* Step 3: Image Upload */}
              {selectedCategory && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Step 3: Upload Images</h3>
                  
                  {/* Thumbnail Upload */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">Thumbnail (Cover Photo) *</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center">
                      <Upload className="w-6 h-6 text-white/60 mx-auto mb-2" />
                      <p className="text-white/60 mb-2 text-sm">Upload thumbnail image</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
                        disabled={uploadingImages}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                    {newProject.thumbnail_url && (
                      <div className="relative w-24 h-24 mx-auto">
                        <img 
                          src={newProject.thumbnail_url} 
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setNewProject({...newProject, thumbnail_url: ''})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Images Upload */}
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
                    <p className="text-white/60 mb-4">Upload additional project images</p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      disabled={uploadingImages}
                      className="max-w-xs mx-auto"
                    />
                  </div>

                  {/* Uploaded Images Preview */}
                  {newProject.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {newProject.images.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={imageUrl} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Legacy Image URLs */}
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Main Image URL (optional)"
                      value={newProject.image_url}
                      onChange={(e) => setNewProject({...newProject, image_url: e.target.value})}
                    />
                    <Input
                      placeholder="Thumbnail URL (backup)"
                      value={newProject.thumbnail_url}
                      onChange={(e) => setNewProject({...newProject, thumbnail_url: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Category-Specific Fields */}
              {selectedCategory && getCategorySpecificFields()}

              {/* Step 5: Display Options */}
              {selectedCategory && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Step 5: Display Options</h3>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={newProject.show_on_home}
                        onChange={(e) => setNewProject({...newProject, show_on_home: e.target.checked})}
                        className="rounded"
                      />
                      Show on Home Page
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={newProject.is_featured}
                        onChange={(e) => setNewProject({...newProject, is_featured: e.target.checked})}
                        className="rounded"
                      />
                      Featured Project
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleAddProject} 
                  className="glow-button flex-1"
                  disabled={!newProject.title || !newProject.category_id || !newProject.thumbnail_url || uploadingImages}
                >
                  {uploadingImages ? 'Uploading...' : 'Add Project'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddProject(false);
                    resetNewProject();
                  }}
                  className="glass-card border-white/20 flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent className="max-w-2xl glass-card border-white/20 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Project</DialogTitle>
            </DialogHeader>
            {editingProject && (
              <div className="space-y-4">
                <Input
                  placeholder="Project Title *"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                />
                <Textarea
                  placeholder="Description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                />
                <Select 
                  value={editingProject.category_id}
                  onValueChange={(value) => setEditingProject({...editingProject, category_id: value})}
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
                    placeholder="Main Image URL"
                    value={editingProject.image_url || ''}
                    onChange={(e) => setEditingProject({...editingProject, image_url: e.target.value})}
                  />
                  <Input
                    placeholder="Demo URL"
                    value={editingProject.demo_url || ''}
                    onChange={(e) => setEditingProject({...editingProject, demo_url: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Code URL"
                    value={editingProject.code_url || ''}
                    onChange={(e) => setEditingProject({...editingProject, code_url: e.target.value})}
                  />
                  <Input
                    placeholder="Instagram URL"
                    value={editingProject.instagram_url || ''}
                    onChange={(e) => setEditingProject({...editingProject, instagram_url: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Brand Name"
                    value={editingProject.brand_name || ''}
                    onChange={(e) => setEditingProject({...editingProject, brand_name: e.target.value})}
                  />
                  <Input
                    placeholder="Client Name"
                    value={editingProject.client_name || ''}
                    onChange={(e) => setEditingProject({...editingProject, client_name: e.target.value})}
                  />
                </div>
                <Input
                  type="number"
                  placeholder="YouTube Views"
                  value={editingProject.youtube_views || ''}
                  onChange={(e) => setEditingProject({...editingProject, youtube_views: parseInt(e.target.value) || 0})}
                />
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={editingProject.show_on_home}
                      onChange={(e) => setEditingProject({...editingProject, show_on_home: e.target.checked})}
                      className="rounded"
                    />
                    Show on Home Page
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={editingProject.is_featured}
                      onChange={(e) => setEditingProject({...editingProject, is_featured: e.target.checked})}
                      className="rounded"
                    />
                    Featured Project
                  </label>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleUpdateProject} className="glow-button flex-1">
                    Update Project
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingProject(null)}
                    className="glass-card border-white/20 flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;