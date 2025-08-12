import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de base de l'API
export const api = axios.create({
  baseURL: 'http://localhost:3000/api', // URL de votre backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@DocsCivil:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      try {
        await AsyncStorage.removeItem('@DocsCivil:token');
        await AsyncStorage.removeItem('@DocsCivil:user');
        // Rediriger vers la page de connexion
        // Cette logique sera gérée dans le composant d'authentification
      } catch (storageError) {
        console.error('Erreur lors de la suppression du token:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// Service des utilisateurs
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/password', passwordData),
};

// Service des prospects
export const prospectService = {
  getAll: (params) => api.get('/prospects', { params }),
  getById: (id) => api.get(`/prospects/${id}`),
  create: (prospectData) => api.post('/prospects', prospectData),
  update: (id, prospectData) => api.put(`/prospects/${id}`, prospectData),
  delete: (id) => api.delete(`/prospects/${id}`),
  getByListe: (liste) => api.get(`/prospects/liste/${liste}`),
};

// Service des communes
export const communeService = {
  getAll: () => api.get('/communes'),
  getById: (id) => api.get(`/communes/${id}`),
  create: (communeData) => api.post('/communes', communeData),
  update: (id, communeData) => api.put(`/communes/${id}`, communeData),
  delete: (id) => api.delete(`/communes/${id}`),
};

// Service des localités
export const localiteService = {
  getAll: () => api.get('/localites'),
  getById: (id) => api.get(`/localites/${id}`),
  create: (localiteData) => api.post('/localites', localiteData),
  update: (id, localiteData) => api.put(`/localites/${id}`, localiteData),
  delete: (id) => api.delete(`/localites/${id}`),
};

// Service des juridictions
export const juridictionService = {
  getAll: () => api.get('/juridictions'),
  getById: (id) => api.get(`/juridictions/${id}`),
  create: (juridictionData) => api.post('/juridictions', juridictionData),
  update: (id, juridictionData) => api.put(`/juridictions/${id}`, juridictionData),
  delete: (id) => api.delete(`/juridictions/${id}`),
};

// Service des zones
export const zoneService = {
  getAll: () => api.get('/zones'),
  getById: (id) => api.get(`/zones/${id}`),
  create: (zoneData) => api.post('/zones', zoneData),
  update: (id, zoneData) => api.put(`/zones/${id}`, zoneData),
  delete: (id) => api.delete(`/zones/${id}`),
};

// Service des états
export const etatService = {
  getAll: () => api.get('/etats'),
  getById: (id) => api.get(`/etats/${id}`),
  create: (etatData) => api.post('/etats', etatData),
  update: (id, etatData) => api.put(`/etats/${id}`, etatData),
  delete: (id) => api.delete(`/etats/${id}`),
};

// Service des types de copie
export const typeCopieService = {
  getAll: () => api.get('/typecopies'),
  getById: (id) => api.get(`/typecopies/${id}`),
  create: (typeCopieData) => api.post('/typecopies', typeCopieData),
  update: (id, typeCopieData) => api.put(`/typecopies/${id}`, typeCopieData),
  delete: (id) => api.delete(`/typecopies/${id}`),
};

// Service des listes de diffusion
export const listeDiffusionService = {
  getAll: () => api.get('/listediffusions'),
  getById: (id) => api.get(`/listediffusions/${id}`),
  create: (listeData) => api.post('/listediffusions', listeData),
  update: (id, listeData) => api.put(`/listediffusions/${id}`, listeData),
  delete: (id) => api.delete(`/listediffusions/${id}`),
};

// Service des appareils
export const deviceService = {
  getAll: () => api.get('/devices'),
  getById: (id) => api.get(`/devices/${id}`),
  create: (deviceData) => api.post('/devices', deviceData),
  update: (id, deviceData) => api.put(`/devices/${id}`, deviceData),
  delete: (id) => api.delete(`/devices/${id}`),
};

// Configuration pour le développement
if (__DEV__) {
  // Log des requêtes en mode développement
  api.interceptors.request.use((config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      console.log('✅ API Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('❌ API Error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );
}