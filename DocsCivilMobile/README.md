# DocsCivil Mobile Application

Une application mobile moderne pour la gestion documentaire civile, développée avec React Native et Expo.

## 🚀 Fonctionnalités

### 🔐 Authentification
- Connexion sécurisée avec email/mot de passe
- Inscription avec validation complète des données
- Gestion automatique des tokens JWT
- Interface utilisateur moderne et intuitive

### 🏠 Dashboard
- Aperçu statistique de l'activité
- Actions rapides pour les tâches courantes
- Activité récente des prospects
- Navigation fluide vers toutes les sections

### 👥 Gestion des Prospects
- Liste complète avec recherche et filtrage
- Création et modification de prospects
- Validation des données en temps réel
- Gestion des statuts (Actif, Inactif, Suspendu)
- Support pour les listes de diffusion

### 📍 Gestion des Localités
- Visualisation des communes
- Gestion des localités
- Navigation par zones
- Système de juridictions

### 📄 Gestion des Documents
- Types de documents
- États des documents
- Interface organisée par onglets
- Statistiques en temps réel

### 👤 Profil Utilisateur
- Informations personnelles complètes
- Statistiques utilisateur
- Paramètres et préférences
- Déconnexion sécurisée

## 🛠️ Technologies Utilisées

- **React Native** avec Expo
- **React Navigation** pour la navigation
- **Axios** pour les appels API
- **AsyncStorage** pour le stockage local
- **React Native Paper** pour les composants UI
- **Expo Vector Icons** pour les icônes

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Expo CLI
- Android Studio (pour Android) ou Xcode (pour iOS)

## 🔧 Installation et Configuration

### 1. Cloner le projet
```bash
cd DocsCivilMobile
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'API

Modifier le fichier `src/constants/config.js` pour pointer vers votre serveur backend :

```javascript
export const CONFIG = {
  API_BASE_URL: 'http://votre-serveur:3000/api', // Remplacer par votre URL
  // ... autres configurations
};
```

### 4. Lancer l'application

#### Développement avec Expo
```bash
npm start
```

#### Android
```bash
npm run android
```

#### iOS (macOS uniquement)
```bash
npm run ios
```

#### Web
```bash
npm run web
```

## 📱 Structure du Projet

```
DocsCivilMobile/
├── src/
│   ├── constants/          # Configuration et constantes
│   ├── services/           # Services API
│   ├── navigation/         # Configuration de navigation
│   ├── screens/           # Écrans de l'application
│   │   ├── auth/          # Authentification
│   │   ├── main/          # Dashboard principal
│   │   ├── prospects/     # Gestion des prospects
│   │   ├── profile/       # Profil utilisateur
│   │   ├── locations/     # Localités
│   │   ├── documents/     # Documents
│   │   └── common/        # Composants communs
│   └── components/        # Composants réutilisables
├── assets/               # Images et ressources
└── README.md
```

## 🎨 Design System

L'application utilise un système de design cohérent avec :

- **Couleurs** : Palette moderne avec couleurs primaires et secondaires
- **Typographie** : Système de tailles et poids de police standardisés
- **Espacement** : Système d'espacement uniforme
- **Composants** : Interface utilisateur moderne et responsive

### Palette de Couleurs
- **Primaire** : #2E3A87 (Bleu professionnel)
- **Secondaire** : #4CAF50 (Vert succès)
- **Accent** : #FF6B35 (Orange dynamique)
- **Arrière-plan** : #F5F5F5 (Gris clair)
- **Surface** : #FFFFFF (Blanc)

## 🔗 API Backend

L'application se connecte à l'API backend DocsCivil avec les endpoints suivants :

- **Authentification** : `/auth/login`, `/auth/register`, `/auth/logout`
- **Utilisateurs** : `/users/profile`, `/users/update`
- **Prospects** : `/prospects` (CRUD complet)
- **Localités** : `/communes`, `/localites`, `/zones`, `/juridictions`
- **Documents** : `/typecopies`, `/etats`

## 📚 Guide d'Utilisation

### Première Connexion
1. Ouvrir l'application
2. Créer un compte ou se connecter
3. Explorer le dashboard principal
4. Naviguer via les onglets du bas

### Gestion des Prospects
1. Aller dans l'onglet "Prospects"
2. Utiliser le bouton "+" pour ajouter un prospect
3. Rechercher avec la barre de recherche
4. Appuyer sur un prospect pour le modifier

### Navigation
- **5 onglets principaux** : Accueil, Prospects, Documents, Localités, Profil
- **Recherche** disponible dans la plupart des sections
- **Actions rapides** depuis le dashboard
- **Navigation contextuelle** avec retour possible

## 🔒 Sécurité

- Authentification JWT avec refresh automatique
- Stockage sécurisé des tokens
- Validation côté client et serveur
- Gestion des erreurs réseau
- Déconnexion automatique en cas d'expiration

## 🐛 Dépannage

### Problèmes Communs

1. **Erreur de connexion API** :
   - Vérifier l'URL dans `config.js`
   - S'assurer que le serveur backend est démarré
   - Vérifier la connectivité réseau

2. **Erreur de build** :
   - Nettoyer le cache : `npm start --clear`
   - Réinstaller les dépendances : `rm -rf node_modules && npm install`

3. **Problème de navigation** :
   - Redémarrer l'application
   - Vérifier les imports des écrans

## 📖 Développement Futur

### Fonctionnalités Prévues
- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Export de données
- [ ] Thème sombre
- [ ] Langues multiples
- [ ] Géolocalisation
- [ ] Scanner de documents
- [ ] Synchronisation en temps réel

### Améliorations Techniques
- [ ] Tests automatisés
- [ ] CI/CD
- [ ] Monitoring des performances
- [ ] Optimisation des images
- [ ] Mise en cache avancée

## 👨‍💻 Développement

### Scripts Disponibles
- `npm start` : Démarrer le serveur de développement
- `npm run android` : Lancer sur Android
- `npm run ios` : Lancer sur iOS
- `npm run web` : Lancer en mode web
- `npm run eject` : Ejecter d'Expo (irréversible)

### Structure des Composants
Chaque écran suit une structure similaire :
- Gestion d'état avec useState
- Appels API avec useEffect
- Interface utilisateur responsive
- Gestion d'erreurs
- Loading states

## 📄 Licence

Ce projet est développé pour DocsCivil - Tous droits réservés.

---

**Version** : 1.0.0  
**Développé avec** : React Native + Expo  
**Compatibilité** : iOS 11+, Android 6.0+