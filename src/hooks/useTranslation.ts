import { useContext } from 'react';
import { UserContext } from '../contexts/AppContexts';
import { translations, SupportedLang } from '../i18n';

export const useTranslation = () => {
  const { lang } = useContext(UserContext);
  
  const t = (section: keyof typeof translations.en, key: string): string => {
    const currentLang = lang as SupportedLang || 'en';
    return translations[currentLang]?.[section]?.[key] || translations.en[section]?.[key] || key;
  };

  return { t, lang };
};

// Función auxiliar para usar con 3 parámetros (manteniendo compatibilidad)
export const getTranslation = (lang: SupportedLang, section: keyof typeof translations.en, key: string): string => {
  return translations[lang]?.[section]?.[key] || translations.en[section]?.[key] || key;
};

// Función temporal para mantener compatibilidad con el código existente
export const t = (lang: SupportedLang, section: keyof typeof translations.en, key: string): string => {
  return translations[lang]?.[section]?.[key] || translations.en[section]?.[key] || key;
};
