import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCarouselImagesAdmin, useCreateCarouselImage, useUpdateCarouselImage, useDeleteCarouselImage } from "@/hooks/use-content";
import { Plus, Edit2, Trash2, Image as ImageIcon, ArrowUp, ArrowDown, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function AdminCarousel() {
  const { data: images = [], isLoading } = useCarouselImagesAdmin();
  const createMutation = useCreateCarouselImage();
  const updateMutation = useUpdateCarouselImage();
  const deleteMutation = useDeleteCarouselImage();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: "",
    title: "",
    description: "",
    order: 0,
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      imageUrl: "",
      title: "",
      description: "",
      order: 0,
      isActive: true
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (image: any) => {
    setFormData({
      imageUrl: image.imageUrl,
      title: image.title || "",
      description: image.description || "",
      order: image.order,
      isActive: image.isActive
    });
    setEditingId(image.id);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData });
        toast({
          title: "Image updated successfully",
          description: "Carousel image has been updated",
        });
      } else {
        await createMutation.mutateAsync(formData);
        toast({
          title: "Image added successfully",
          description: "New carousel image has been added",
        });
      }
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({
          title: "Image deleted",
          description: "Carousel image has been removed",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const moveImage = (id: number, direction: 'up' | 'down') => {
    const image = images.find((img: any) => img.id === id);
    if (!image) return;

    const newOrder = direction === 'up' ? image.order - 1 : image.order + 1;
    updateMutation.mutate({ id, order: newOrder });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Homepage Carousel Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">Loading carousel images...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <ImageIcon className="h-5 w-5" />
              Homepage Carousel Manager ({images.length} images)
            </CardTitle>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Image
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border rounded-lg p-6 bg-gray-800 border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {editingId ? "Edit Carousel Image" : "Add New Carousel Image"}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Image URL *
                      </label>
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Title
                      </label>
                      <Input
                        placeholder="Image title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Description
                    </label>
                    <Textarea
                      placeholder="Image description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Display Order
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <label className="text-sm font-medium text-white">
                        Active (show on website)
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? "Update Image" : "Add Image"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Carousel Images</h3>
            <ScrollArea className="h-96 w-full rounded-md border border-gray-700 p-4 bg-gray-800">
              <div className="space-y-4">
                {images.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No images added yet. Click "Add New Image" to get started.
                  </div>
                ) : (
                  images.map((image: any) => (
                    <motion.div
                      key={image.id}
                      layout
                      className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg bg-gray-900"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={image.imageUrl}
                          alt={image.title || "Carousel image"}
                          className="w-20 h-12 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA4MCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0zNS41IDE0SDQ0LjVMMzkgMjAuNUwzNS41IDE0WiIgZmlsbD0iIzZCNzI4MCIvPgo8Y2lyY2xlIGN4PSIzMiIgY3k9IjE4IiByPSIyIiBmaWxsPSIjNkI3MjgwIi8+CjwvY3ZnPgo=';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate text-white">
                            {image.title || "Untitled Image"}
                          </h4>
                          <Badge variant={image.isActive ? "default" : "secondary"}>
                            {image.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="text-gray-300 border-gray-600">
                            Order: {image.order}
                          </Badge>
                        </div>
                        {image.description && (
                          <p className="text-sm text-gray-400 truncate">
                            {image.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {image.imageUrl}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveImage(image.id, 'up')}
                          disabled={updateMutation.isPending}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveImage(image.id, 'down')}
                          disabled={updateMutation.isPending}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(image)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(image.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}