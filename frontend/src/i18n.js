import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to our application",
          switchLanguage: "Switch Language",
        },
      },
      fr: {
        translation: {
          welcome: "Bienvenue dans notre application",
          switchLanguage: "Changer de langue",
        },
      },
      // Add more languages here
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;

// src/App.js
import React, { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';
import ErrorBoundary from './ErrorBoundary'; // Custom Error Boundary
import './App.css'; // Import your CSS for styling

const LanguageSwitcher = () => {
  const { t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>{t('switchLanguage')} to English</button>
      <button onClick={() => changeLanguage('fr')}>{t('switchLanguage')} to French</button>
    </div>
  );
};

const MainContent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <LanguageSwitcher />
    </div>
  );
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading...</div>}>
          <MainContent />
        </React.Suspense>
      </ErrorBoundary>
    </I18nextProvider>
  );
}

export default App;

// src/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

// src/App.css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

h1 {
  color: #333;
}

button {
  margin: 5px;
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
