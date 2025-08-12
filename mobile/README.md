# DocsCivil Mobile App

Application mobile React Native pour la gestion des documents civils, développée pour fonctionner avec l'API DocsCivil existante.

## 🚀 Fonctionnalités

### 🔐 Authentification
- Connexion utilisateur avec email et mot de passe
- Inscription de nouveaux utilisateurs
- Gestion des sessions avec stockage local sécurisé
- Déconnexion automatique en cas d'expiration du token

### 📊 Tableau de bord
- Vue d'ensemble des statistiques (prospects, juridictions, zones, communes)
- Actions rapides vers les principales fonctionnalités
- Informations système et statut de l'API
- Interface moderne avec cartes et indicateurs visuels

### 👥 Gestion des prospects
- Liste complète des prospects avec recherche
- Filtrage par statut et autres critères
- Actions CRUD (Créer, Lire, Mettre à jour, Supprimer)
- Affichage des informations détaillées (juridiction, zone, commune)

### ⚖️ Gestion des juridictions
- Liste des juridictions avec recherche
- Gestion des types et régions
- Statuts actif/inactif
- Interface intuitive avec cartes

### 🗺️ Gestion des zones
- Configuration des zones géographiques
- Informations sur la population et le type
- Association avec les régions
- Gestion des statuts

### 🏘️ Gestion des communes et localités
- Liste des communes avec codes et départements
- Gestion des localités avec types
- Association avec les zones et juridictions

### 🏛️ Gestion des états
- Configuration des états administratifs
- Types et régions associés
- Gestion des statuts

### 📄 Types de copies
- Configuration des types de documents
- Catégorisation et marquage requis
- Gestion des statuts

### 📋 Listes de diffusion
- Gestion des listes de destinataires
- Types et compteurs de destinataires
- Statuts actif/inactif

### 💻 Gestion des appareils
- Inventaire des équipements
- Numéros de série et localisation
- Statuts et types d'appareils

### 👤 Gestion des utilisateurs
- Profils utilisateurs avec avatars
- Rôles administrateur/utilisateur
- Gestion des départements
- Statuts actif/inactif

### ⚙️ Profil utilisateur
- Modification des informations personnelles
- Changement de mot de passe
- Préférences de notifications
- Informations système

## 🛠️ Technologies utilisées

- **React Native** 0.72.6
- **React Navigation** pour la navigation
- **React Native Paper** pour les composants UI
- **React Native Vector Icons** pour les icônes
- **Axios** pour les requêtes HTTP
- **AsyncStorage** pour le stockage local
- **Context API** pour la gestion d'état globale

## 📱 Architecture

### Structure des dossiers
```
src/
├── components/          # Composants réutilisables
├── contexts/           # Contextes React (Auth, Theme)
├── navigation/         # Configuration de la navigation
├── screens/            # Écrans de l'application
│   ├── auth/          # Écrans d'authentification
│   └── main/          # Écrans principaux
├── services/           # Services API
└── theme/              # Configuration du thème
```

### Navigation
- **Stack Navigator** pour l'authentification
- **Drawer Navigator** pour le menu principal
- **Tab Navigator** pour le tableau de bord
- Navigation conditionnelle basée sur l'état d'authentification

### Gestion d'état
- **AuthContext** : Gestion de l'authentification et des sessions
- **ThemeContext** : Gestion du thème et des préférences visuelles
- **Services API** : Communication avec le backend

## 🚀 Installation et configuration

### Prérequis
- Node.js 16+
- React Native CLI
- Android Studio (pour Android)
- Xcode (pour iOS, macOS uniquement)

### Installation des dépendances
```bash
cd mobile
npm install
```

### Configuration de l'API
Modifiez le fichier `src/services/api.js` pour pointer vers votre serveur :
```javascript
export const api = axios.create({
  baseURL: 'http://VOTRE_IP:3000/api', // Remplacez par votre IP
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Lancement de l'application

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Métro bundler
```bash
npm start
```

## 🎨 Thème et personnalisation

L'application utilise un système de thème personnalisable avec :
- Couleurs primaires et secondaires
- Support du mode sombre/clair
- Composants Material Design
- Styles cohérents dans toute l'application

### Personnalisation des couleurs
Modifiez le fichier `src/theme/theme.js` pour changer les couleurs :
```javascript
export const theme = {
  colors: {
    primary: '#1976D2',      // Couleur principale
    accent: '#FF9800',       // Couleur d'accent
    background: '#F5F5F5',   // Couleur de fond
    // ... autres couleurs
  }
};
```

## 🔒 Sécurité

- Authentification JWT avec stockage sécurisé
- Validation des formulaires côté client
- Gestion des erreurs et des sessions expirées
- Intercepteurs Axios pour la sécurité

## 📱 Compatibilité

- **Android** : API 21+ (Android 5.0+)
- **iOS** : iOS 12.0+
- **React Native** : 0.72.6
- **Architectures** : ARM64, x86_64

## 🧪 Tests

```bash
npm test
```

## 📦 Build et déploiement

### Build de production Android
```bash
cd android
./gradlew assembleRelease
```

### Build de production iOS
```bash
cd ios
xcodebuild -workspace DocsCivil.xcworkspace -scheme DocsCivil -configuration Release
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

## 🆘 Support

Pour toute question ou problème :
- Vérifiez la documentation de l'API
- Consultez les logs de l'application
- Vérifiez la connectivité réseau
- Assurez-vous que le serveur backend est en cours d'exécution

## 🔄 Mises à jour

L'application est conçue pour être facilement mise à jour :
- Structure modulaire
- Composants réutilisables
- Configuration centralisée
- Gestion des versions d'API

---

**DocsCivil Mobile** - Gestion moderne des documents civils sur mobile 📱⚖️