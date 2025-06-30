import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useContent(key: string) {
  return useQuery({
    queryKey: [`/api/content/${key}`],
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { key: string; content: any }) => 
      apiRequest("PUT", "/api/admin/content", data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [`/api/content/${variables.key}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/admin/content"] 
      });
    },
  });
}

export function useContactMessages() {
  return useQuery({
    queryKey: ["/api/admin/messages"],
  });
}

export function useServices() {
  return useQuery({
    queryKey: ["/api/services"],
  });
}

export function useNews() {
  return useQuery({
    queryKey: ["/api/news"],
  });
}

export function useCarouselImages() {
  return useQuery({
    queryKey: ["/api/carousel"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCarouselImagesAdmin() {
  return useQuery({
    queryKey: ["/api/admin/carousel"],
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUpdateCarouselImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      return await apiRequest(`/api/admin/carousel/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/carousel"] });
      queryClient.invalidateQueries({ queryKey: ["/api/carousel"] });
    },
  });
}

export function useCreateCarouselImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/admin/carousel", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/carousel"] });
      queryClient.invalidateQueries({ queryKey: ["/api/carousel"] });
    },
  });
}

export function useDeleteCarouselImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/carousel/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/carousel"] });
      queryClient.invalidateQueries({ queryKey: ["/api/carousel"] });
    },
  });
}
