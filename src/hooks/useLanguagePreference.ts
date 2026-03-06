import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguagePreference = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);
};