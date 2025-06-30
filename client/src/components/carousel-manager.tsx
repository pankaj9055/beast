import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCarouselImagesAdmin, useCreateCarouselImage, useUpdateCarouselImage, useDeleteCarouselImage } from "@/hooks/use-content";
import { Plus, Edit2, Trash2, Image as ImageIcon, Move } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselManagerProps {
  onClose?: () => void;
}

export default function CarouselManager({ onClose }: CarouselManagerProps) {
  const { data: images = [], isLoading } = useCarouselImagesAdmin();
  const createMutation = useCreateCarouselImage();
  const updateMutation = useUpdateCarouselImage();
  const deleteMutation = useDeleteCarouselImage();

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
      } else {
        await createMutation.mutateAsync(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting image:", error);
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
          <div className="text-center py-8">Loading images...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Homepage Carousel Manager ({images.length} images)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? "Edit Image" : "Add New Image"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image URL *
                    </label>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title
                    </label>
                    <Input
                      placeholder="Image title (optional)"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    placeholder="Image description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Display Order
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <label className="text-sm font-medium">
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
          <h3 className="text-lg font-semibold">Current Images</h3>
          <ScrollArea className="h-96 w-full rounded-md border p-4">
            <div className="space-y-4">
              {images.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No images added yet. Click "Add Image" to get started.
                </div>
              ) : (
                images.map((image: any) => (
                  <motion.div
                    key={image.id}
                    layout
                    className="flex items-center gap-4 p-4 border rounded-lg bg-white dark:bg-gray-900"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={image.imageUrl}
                        alt={image.title || "Carousel image"}
                        className="w-20 h-12 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/api/placeholder/80/48';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">
                          {image.title || "Untitled Image"}
                        </h4>
                        <Badge variant={image.isActive ? "default" : "secondary"}>
                          {image.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          Order: {image.order}
                        </Badge>
                      </div>
                      {image.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
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
                      >
                        <Move className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(image)}
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
  );
}