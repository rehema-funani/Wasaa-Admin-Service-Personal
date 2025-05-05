import { Language, LanguageFormData, Translation, TranslationFormData } from '../../types/language';
import { api } from '../axios';


export const languageService = {
  getLanguages: async (): Promise<Language[]> => {
    const response = await api.get(`/languages`);
    return response.data;
  },

  getLanguage: async (id: string): Promise<Language> => {
    const response = await api.get(`/languages/${id}`);
    return response.data;
  },

  createLanguage: async (language: LanguageFormData): Promise<Language> => {
    const response = await api.post(`/languages`, language);
    return response.data;
  },

  updateLanguage: async (id: string, language: LanguageFormData): Promise<Language> => {
    const response = await api.put(`/languages/${id}`, language);
    return response.data;
  },

  deleteLanguage: async (id: string): Promise<void> => {
    await api.delete(`/languages/${id}`);
  },

  toggleLanguageStatus: async (id: string, isActive: boolean): Promise<Language> => {
    const response = await api.patch(`/languages/${id}/status`, {
      is_active: isActive
    });
    return response.data;
  },

  setDefaultLanguage: async (id: string): Promise<Language> => {
    const response = await api.patch(`/languages/${id}/default`);
    return response.data;
  }
};

export const translationService = {
  getTranslations: async (id: string): Promise<Translation[]> => {
    const response = await api.get(`languages/${id}/translation`);
    return response.data;
  },

  getTranslation: async (id: string): Promise<Translation> => {
    const response = await api.get(`/translations/${id}`);
    return response.data;
  },

  createTranslation: async (translation: TranslationFormData): Promise<Translation> => {
    const response = await api.post(`/translations`, translation);
    return response.data;
  },

  updateTranslation: async (id: string, translation: TranslationFormData): Promise<Translation> => {
    const response = await api.put(`/translations/${id}`, translation);
    return response.data;
  },

  deleteTranslation: async (id: string): Promise<void> => {
    await api.delete(`/translations/${id}`);
  },

  searchTranslations: async (query: string): Promise<Translation[]> => {
    const response = await api.get(`/translations/search?q=${query}`);
    return response.data;
  },
  
  importTranslations: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/translations/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  exportTranslations: async (): Promise<Blob> => {
    const response = await api.get(`/translations/export`, {
      responseType: 'blob'
    });
    return response.data;
  }
};