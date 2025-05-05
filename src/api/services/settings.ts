import { api } from "../axios";

export interface WebsiteSettings {
  id: string;
  website_name: string;
  website_link?: string;
  website_email?: string;
  website_description?: string;
  website_color_primary?: string;
  website_color_secondary?: string;
  ios_link?: string;
  android_link?: string;
  copy_right?: string;
  tell_a_friend_link?: string;
  max_group_members: number;
  max_group_name_length?: number;
  website_logo?: File | null;
  website_favicon?: File | null;
  banner_image?: File | null;
}

export const settingsService = {
  getSettings: async (): Promise<WebsiteSettings> => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (settingsData: FormData, id: string): Promise<WebsiteSettings> => {
    const response = await api.put(`/settings/${id}`, settingsData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};