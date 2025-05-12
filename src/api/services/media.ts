import { api } from "../axios";

export const mediaService = {
  createMedia: async (data: FormData): Promise<any> => {
    const response = await api.post('/media', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getWallpapers: async () => {
    const response = await api.get(`/media/wallpapers`);
    return response.data;
  },

  getAvatars: async () => {
    const response = await api.get('/media/avatars');
    return response.data;
  },

  deleteMedia: async (id: string) => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  },
};