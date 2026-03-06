import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

interface Language {
  code: string;
  label: string;
  flag?: string;
}

const languages: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'fr', label: 'Français' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsDropdownOpen(false);
    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', languageCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="language-switcher">
      <button
        className="language-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        title={t('header.selectLanguage')}
      >
        <span className="language-label">{currentLanguage.label}</span>
        <span className="dropdown-icon">▼</span>
      </button>
      
      {isDropdownOpen && (
        <div className="language-dropdown">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${
                i18n.language === language.code ? 'active' : ''
              }`}
              onClick={() => handleLanguageChange(language.code)}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;