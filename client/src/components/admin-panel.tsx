import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Settings, 
  MessageSquare, 
  BarChart3, 
  Newspaper,
  LogOut,
  Save,
  Trash2,
  Eye,
  Plus,
  Image as ImageIcon
} from "lucide-react";
import CarouselManager from "@/components/carousel-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminCarousel from "@/components/admin-carousel";

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: contentData = [] } = useQuery({
    queryKey: ["/api/admin/content"],
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/admin/messages"],
  });

  const { data: news = [] } = useQuery({
    queryKey: ["/api/admin/news"],
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/admin/services"],
  });

  // Mutations
  const updateContentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", "/api/admin/content", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Success", description: "Content updated successfully" });
    },
  });

  const markMessageReadMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/admin/messages/${id}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({ title: "Success", description: "Message marked as read" });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/messages/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({ title: "Success", description: "Message deleted" });
    },
  });

  const createNewsMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/news", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Success", description: "News article created" });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/admin/news/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Success", description: "News article updated" });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/news/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Success", description: "News article deleted" });
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/services", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Success", description: "Service created" });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/admin/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Success", description: "Service updated" });
    },
  });

  const getContentByKey = (key: string) => {
    return contentData.find((item: any) => item.key === key)?.content || {};
  };

  const handleContentUpdate = (key: string, content: any) => {
    updateContentMutation.mutate({ key, content });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">VoipFit Admin Panel</h1>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-gray-700">
            <TabsTrigger value="home" className="data-[state=active]:bg-blue-600">
              <Home className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="carousel" className="data-[state=active]:bg-blue-600">
              <ImageIcon className="h-4 w-4 mr-2" />
              Carousel
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-blue-600">
              <Settings className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-blue-600">
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-blue-600">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
              {messages.filter((m: any) => !m.isRead).length > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {messages.filter((m: any) => !m.isRead).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Home Content Tab */}
          <TabsContent value="home">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Home Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <HomeContentEditor 
                  content={getContentByKey("hero")} 
                  onUpdate={(content) => handleContentUpdate("hero", content)}
                />
                <AboutContentEditor 
                  content={getContentByKey("about")} 
                  onUpdate={(content) => handleContentUpdate("about", content)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Company Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <StatsEditor 
                  content={getContentByKey("stats")} 
                  onUpdate={(content) => handleContentUpdate("stats", content)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message: any) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      onMarkRead={() => markMessageReadMutation.mutate(message.id)}
                      onDelete={() => deleteMessageMutation.mutate(message.id)}
                    />
                  ))}
                  {messages.length === 0 && (
                    <p className="text-gray-400 text-center py-8">No messages yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Carousel Tab */}
          <TabsContent value="carousel">
            <AdminCarousel />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Manage Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service: any) => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      onUpdate={(data) => updateServiceMutation.mutate({ id: service.id, data })}
                    />
                  ))}
                  <AddServiceForm onAdd={(data) => createServiceMutation.mutate(data)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Manage News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {news.map((article: any) => (
                    <NewsCard 
                      key={article.id} 
                      article={article} 
                      onUpdate={(data) => updateNewsMutation.mutate({ id: article.id, data })}
                      onDelete={() => deleteNewsMutation.mutate(article.id)}
                    />
                  ))}
                  <AddNewsForm onAdd={(data) => createNewsMutation.mutate(data)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Component for editing hero content
function HomeContentEditor({ content, onUpdate }: { content: any; onUpdate: (content: any) => void }) {
  const [formData, setFormData] = useState({
    title: content.title || "",
    subtitle: content.subtitle || "",
    description: content.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">Hero Section</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-gray-300">Hero Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-gray-900 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label className="text-gray-300">Hero Subtitle</Label>
          <Input
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="bg-gray-900 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label className="text-gray-300">Hero Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-gray-900 border-gray-600 text-white"
            rows={3}
          />
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Update Hero Content
        </Button>
      </form>
    </motion.div>
  );
}

// Component for editing about content
function AboutContentEditor({ content, onUpdate }: { content: any; onUpdate: (content: any) => void }) {
  const [formData, setFormData] = useState({
    title: content.title || "",
    description: content.description || "",
    mission: content.mission || "",
    vision: content.vision || "",
    values: content.values || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">About Section</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-gray-300">About Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-gray-900 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label className="text-gray-300">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-gray-900 border-gray-600 text-white"
            rows={3}
          />
        </div>
        <div>
          <Label className="text-gray-300">Mission</Label>
          <Textarea
            value={formData.mission}
            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
            className="bg-gray-900 border-gray-600 text-white"
            rows={3}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Vision</Label>
            <Input
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="bg-gray-900 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Values</Label>
            <Input
              value={formData.values}
              onChange={(e) => setFormData({ ...formData, values: e.target.value })}
              className="bg-gray-900 border-gray-600 text-white"
            />
          </div>
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Update About Content
        </Button>
      </form>
    </motion.div>
  );
}

// Component for editing stats
function StatsEditor({ content, onUpdate }: { content: any; onUpdate: (content: any) => void }) {
  const [formData, setFormData] = useState({
    establishedYear: content.establishedYear || "",
    countries: content.countries || "",
    dailyCalls: content.dailyCalls || "",
    uptime: content.uptime || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300">Established Year</Label>
          <Input
            value={formData.establishedYear}
            onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
            className="bg-gray-900 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label className="text-gray-300">Countries Served</Label>
          <Input
            value={formData.countries}
            onChange={(e) => setFormData({ ...formData, countries: e.target.value })}
            className="bg-gray-900 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label className="text-gray-300">Daily Calls</Label>
          <Input
            value={formData.dailyCalls}
            onChange={(e) => setFormData({ ...formData, dailyCalls: e.target.value })}
            className="bg-gray-900 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label className="text-gray-300">Uptime Percentage</Label>
          <Input
            value={formData.uptime}
            onChange={(e) => setFormData({ ...formData, uptime: e.target.value })}
            className="bg-gray-900 border-gray-600 text-white"
          />
        </div>
      </div>
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        <Save className="h-4 w-4 mr-2" />
        Update Statistics
      </Button>
    </form>
  );
}

// Component for displaying message cards
function MessageCard({ message, onMarkRead, onDelete }: { message: any; onMarkRead: () => void; onDelete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900 border rounded-lg p-4 ${message.isRead ? 'border-gray-600' : 'border-blue-600'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-semibold">{message.name}</h3>
          <p className="text-gray-400 text-sm">{message.email}</p>
        </div>
        <div className="flex items-center space-x-2">
          {!message.isRead && (
            <Badge variant="secondary">New</Badge>
          )}
          <span className="text-gray-400 text-sm">
            {new Date(message.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <p className="text-white font-medium mb-2">Subject: {message.subject}</p>
      <p className="text-gray-400 mb-4">{message.message}</p>
      <div className="flex space-x-2">
        {!message.isRead && (
          <Button
            onClick={onMarkRead}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Mark Read
          </Button>
        )}
        <Button
          onClick={onDelete}
          size="sm"
          variant="destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </motion.div>
  );
}

// Component for displaying service cards with edit functionality
function ServiceCard({ service, onUpdate }: { service: any; onUpdate: (data: any) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: service.name,
    description: service.description,
    features: service.features.join(', '),
    icon: service.icon,
    color: service.color,
    isActive: service.isActive
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      features: formData.features.split(',').map(f => f.trim())
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-600 rounded-lg p-4"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Service Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Icon</Label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="MessageSquare">MessageSquare</option>
                <option value="Phone">Phone</option>
                <option value="Database">Database</option>
              </select>
            </div>
          </div>
          
          <div>
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              rows={2}
              required
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Features (comma separated)</Label>
            <Textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              rows={2}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Color</Label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="emerald">Emerald</option>
                <option value="amber">Amber</option>
                <option value="blue">Blue</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`active-${service.id}`}
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor={`active-${service.id}`} className="text-gray-300">Active</Label>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-600 rounded-lg p-4"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-semibold">{service.name}</h3>
          <p className="text-gray-400 text-sm">{service.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={service.isActive ? "default" : "secondary"}>
            {service.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Edit
          </Button>
        </div>
      </div>
      <div className="text-gray-400 text-sm">
        Features: {service.features.join(', ')}
      </div>
    </motion.div>
  );
}

// Component for adding new services
function AddServiceForm({ onAdd }: { onAdd: (data: any) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: '',
    icon: 'MessageSquare',
    color: 'blue',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      features: formData.features.split(',').map(f => f.trim())
    });
    setFormData({
      name: '',
      description: '',
      features: '',
      icon: 'MessageSquare',
      color: 'blue',
      isActive: true
    });
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <Button
        onClick={() => setIsAdding(true)}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Service
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-green-600 rounded-lg p-4"
    >
      <h3 className="text-white font-semibold mb-4">Add New Service</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Service Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-gray-300">Icon</Label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2"
            >
              <option value="MessageSquare">MessageSquare</option>
              <option value="Phone">Phone</option>
              <option value="Database">Database</option>
            </select>
          </div>
        </div>
        
        <div>
          <Label className="text-gray-300">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            rows={2}
            required
          />
        </div>
        
        <div>
          <Label className="text-gray-300">Features (comma separated)</Label>
          <Textarea
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            rows={2}
            required
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Color</Label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2"
            >
              <option value="emerald">Emerald</option>
              <option value="amber">Amber</option>
              <option value="blue">Blue</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="new-active"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="new-active" className="text-gray-300">Active</Label>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsAdding(false)}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

// Component for displaying news cards with edit functionality
function NewsCard({ article, onUpdate, onDelete }: { article: any; onUpdate: (data: any) => void; onDelete: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    imageUrl: article.imageUrl || '',
    isPublished: article.isPublished
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-600 rounded-lg p-4"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-gray-300">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Excerpt</Label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              rows={2}
              required
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Content</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              rows={4}
              required
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Image URL</Label>
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`published-${article.id}`}
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor={`published-${article.id}`} className="text-gray-300">Published</Label>
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-600 rounded-lg p-4"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-white font-semibold">{article.title}</h3>
          <p className="text-gray-400 text-sm">{article.excerpt}</p>
          <p className="text-gray-500 text-xs mt-1">
            {new Date(article.publishedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={article.isPublished ? "default" : "secondary"}>
            {article.isPublished ? "Published" : "Draft"}
          </Badge>
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Edit
          </Button>
          <Button
            onClick={onDelete}
            size="sm"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Component for adding new news articles
function AddNewsForm({ onAdd }: { onAdd: (data: any) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    isPublished: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      isPublished: true
    });
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <Button
        onClick={() => setIsAdding(true)}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Article
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-green-600 rounded-lg p-4"
    >
      <h3 className="text-white font-semibold mb-4">Add New Article</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-gray-300">Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label className="text-gray-300">Excerpt</Label>
          <Textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            rows={2}
            required
          />
        </div>
        
        <div>
          <Label className="text-gray-300">Content</Label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            rows={4}
            required
          />
        </div>
        
        <div>
          <Label className="text-gray-300">Image URL</Label>
          <Input
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="new-published"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4"
          />
          <Label htmlFor="new-published" className="text-gray-300">Published</Label>
        </div>
        
        <div className="flex space-x-2">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsAdding(false)}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}