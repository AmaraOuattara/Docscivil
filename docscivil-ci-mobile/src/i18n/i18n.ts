import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  fr: {
    translation: {
      signIn: {
        title: 'Connexion',
        email: 'Email',
        password: 'Mot de passe',
        continueGuest: 'Continuer sans compte',
      },
      tabs: {
        home: 'Accueil',
        documents: 'Documents',
        notifications: 'Notifications',
        profile: 'Profil',
      },
    },
  },
};

export const initI18n = () => {
  if (i18n.isInitialized) return i18n;
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources,
      lng: Localization.getLocales()[0]?.languageCode ?? 'fr',
      fallbackLng: 'fr',
      interpolation: { escapeValue: false },
    });
  return i18n;
};