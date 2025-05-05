export interface Language {
  id?: string;
  name: string;
  code: string;
  country: string;
  is_active: boolean;
  is_default: boolean;
  is_rtl: boolean;
}

export interface Translation {
  id?: string;
  key: string;
  translations: TranslationItem[];
  hasTranslation?: boolean; // Add this optional property
  currentTranslation?: string;
}

export interface TranslationItem {
  language_id: string;
  translation: string;
}

export interface LanguageFormData {
  name: string;
  code: string;
  country: string;
  is_active: boolean;
  is_default: boolean;
  is_rtl: boolean;
}

export interface TranslationFormData {
  key: string;
  translations: TranslationItem[];
}