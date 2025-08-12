# DocsCivil CI - Application Mobile

Une application mobile moderne et élégante pour la gestion des documents civils, développée avec React Native et Expo.

## 🚀 Fonctionnalités

### 🔐 Authentification
- **Connexion** : Authentification par numéro de téléphone et mot de passe
- **Inscription** : Création de compte utilisateur avec validation
- **Gestion des sessions** : Tokens JWT et persistance des données

### 📱 Interface utilisateur
- **Design moderne** : Interface Material Design avec React Native Paper
- **Navigation intuitive** : Navigation par onglets et drawer
- **Thème personnalisable** : Système de couleurs et styles cohérents
- **Responsive** : Adaptation à différentes tailles d'écran

### 👥 Gestion des prospects
- **Liste des prospects** : Affichage avec pagination et recherche
- **Ajout/Modification** : Formulaires de création et édition
- **Filtres** : Filtrage par statut et recherche textuelle
- **Statuts** : En attente, En cours, Terminé

### 📄 Gestion des documents
- **Types de documents** : Actes de naissance, mariage, décès, certificats
- **Métadonnées** : Titre, description, catégorie, prospect associé
- **Statuts** : Suivi de l'avancement des documents

### 📷 Fonctionnalités avancées
- **Scanner QR** : Lecture de codes QR pour identification rapide
- **Appareil photo** : Capture de photos de documents
- **Galerie** : Gestion des images capturées

### ⚙️ Paramètres
- **Profil utilisateur** : Modification des informations personnelles
- **Sécurité** : Changement de mot de passe
- **Notifications** : Gestion des alertes push
- **Thème** : Mode sombre/clair
- **Sauvegarde** : Export et sauvegarde des données

## 🛠️ Technologies utilisées

- **React Native** : Framework de développement mobile
- **Expo** : Plateforme de développement et déploiement
- **React Navigation** : Navigation entre écrans
- **React Native Paper** : Composants Material Design
- **AsyncStorage** : Stockage local des données
- **Axios** : Client HTTP pour les API
- **Ionicons** : Icônes vectorielles

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Expo CLI
- Android Studio (pour le développement Android)
- Xcode (pour le développement iOS, macOS uniquement)

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd mobile-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configurer l'API backend**
   - Modifier l'URL de l'API dans `src/services/api.js`
   - Assurez-vous que votre backend est en cours d'exécution

4. **Démarrer l'application**
   ```bash
   npm start
   # ou
   yarn start
   ```

5. **Tester sur un appareil**
   - Scannez le QR code avec l'application Expo Go
   - Ou utilisez un émulateur Android/iOS

## 🏗️ Structure du projet

```
mobile-app/
├── src/
│   ├── contexts/          # Contextes React (Auth, etc.)
│   ├── screens/           # Écrans de l'application
│   ├── services/          # Services API et utilitaires
│   └── theme/             # Configuration du thème
├── assets/                # Images et ressources
├── App.js                 # Composant principal
├── app.json              # Configuration Expo
└── package.json          # Dépendances du projet
```

## 📱 Écrans principaux

### 1. **LoginScreen** - Connexion
- Formulaire de connexion avec validation
- Design moderne avec logo et animations
- Navigation vers l'inscription

### 2. **HomeScreen** - Tableau de bord
- Statistiques des prospects
- Actions rapides (nouveau prospect, scanner QR, etc.)
- Liste des prospects récents

### 3. **ProspectsScreen** - Gestion des prospects
- Liste avec recherche et filtres
- Ajout/modification/suppression
- Pagination et gestion des états

### 4. **DocumentsScreen** - Gestion des documents
- Catégorisation des documents
- Métadonnées et statuts
- Interface intuitive

### 5. **ProfileScreen** - Profil utilisateur
- Informations personnelles
- Modification du profil
- Changement de mot de passe

### 6. **SettingsScreen** - Paramètres
- Configuration de l'application
- Gestion des données
- Support et aide

### 7. **ScanQRScreen** - Scanner QR
- Interface de scan avec overlay
- Saisie manuelle de codes
- Traitement des données scannées

### 8. **CameraScreen** - Appareil photo
- Capture de photos
- Gestion des métadonnées
- Galerie des images

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :
```env
API_BASE_URL=http://localhost:3000/api
```

### Configuration de l'API
Modifiez `src/services/api.js` pour pointer vers votre backend :
```javascript
export const api = axios.create({
  baseURL: 'http://votre-api.com/api',
  // ...
});
```

## 📱 Déploiement

### Build de production
```bash
# Android
expo build:android

# iOS
expo build:ios
```

### Publication sur les stores
```bash
# Soumettre à Google Play Store
expo upload:android

# Soumettre à App Store
expo upload:ios
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de métro bundler**
   ```bash
   npm start -- --reset-cache
   ```

2. **Problèmes de permissions Android**
   - Vérifiez les permissions dans `app.json`
   - Redémarrez l'émulateur

3. **Erreurs de dépendances**
   ```bash
   rm -rf node_modules
   npm install
   ```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Contactez l'équipe de développement
- Consultez la documentation technique

## 🔮 Roadmap

- [ ] Mode hors ligne
- [ ] Synchronisation cloud
- [ ] Notifications push
- [ ] Mode sombre
- [ ] Support multilingue
- [ ] Analytics et reporting
- [ ] Intégration biométrique
- [ ] Export PDF/Excel

---

**DocsCivil CI** - Simplifiez la gestion de vos documents civils ! 🚀