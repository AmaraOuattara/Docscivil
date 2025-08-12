import axios from 'react-native-axios';

// Configuration de l'API
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    // Le token sera ajouté par le contexte d'authentification
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
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      // Rediriger vers la page de connexion
      console.log('Token expiré, redirection vers la connexion');
    }
    return Promise.reject(error);
  }
);

// Services pour les différentes entités
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export const prospectService = {
  getAll: (params) => api.get('/prospects', { params }),
  getById: (id) => api.get(`/prospects/${id}`),
  create: (prospectData) => api.post('/prospects', prospectData),
  update: (id, prospectData) => api.put(`/prospects/${id}`, prospectData),
  delete: (id) => api.delete(`/prospects/${id}`),
};

export const juridictionService = {
  getAll: () => api.get('/juridictions'),
  getById: (id) => api.get(`/juridictions/${id}`),
  create: (juridictionData) => api.post('/juridictions', juridictionData),
  update: (id, juridictionData) => api.put(`/juridictions/${id}`, juridictionData),
  delete: (id) => api.delete(`/juridictions/${id}`),
};

export const zoneService = {
  getAll: () => api.get('/zones'),
  getById: (id) => api.get(`/zones/${id}`),
  create: (zoneData) => api.post('/zones', zoneData),
  update: (id, zoneData) => api.put(`/zones/${id}`, zoneData),
  delete: (id) => api.delete(`/zones/${id}`),
};

export const communeService = {
  getAll: () => api.get('/communes'),
  getById: (id) => api.get(`/communes/${id}`),
  create: (communeData) => api.post('/communes', communeData),
  update: (id, communeData) => api.put(`/communes/${id}`, communeData),
  delete: (id) => api.delete(`/communes/${id}`),
};

export const localiteService = {
  getAll: () => api.get('/localites'),
  getById: (id) => api.get(`/localites/${id}`),
  create: (localiteData) => api.post('/localites', localiteData),
  update: (id, localiteData) => api.put(`/localites/${id}`, localiteData),
  delete: (id) => api.delete(`/localites/${id}`),
};

export const etatService = {
  getAll: () => api.get('/etats'),
  getById: (id) => api.get(`/etats/${id}`),
  create: (etatData) => api.post('/etats', etatData),
  update: (id, etatData) => api.put(`/etats/${id}`, etatData),
  delete: (id) => api.delete(`/etats/${id}`),
};

export const typeCopieService = {
  getAll: () => api.get('/typecopies'),
  getById: (id) => api.get(`/typecopies/${id}`),
  create: (typeCopieData) => api.post('/typecopies', typeCopieData),
  update: (id, typeCopieData) => api.put(`/typecopies/${id}`, typeCopieData),
  delete: (id) => api.delete(`/typecopies/${id}`),
};

export const listeDiffusionService = {
  getAll: () => api.get('/listediffusions'),
  getById: (id) => api.get(`/listediffusions/${id}`),
  create: (listeDiffusionData) => api.post('/listediffusions', listeDiffusionData),
  update: (id, listeDiffusionData) => api.put(`/listediffusions/${id}`, listeDiffusionData),
  delete: (id) => api.delete(`/listediffusions/${id}`),
};

export const deviceService = {
  getAll: () => api.get('/devices'),
  getById: (id) => api.get(`/devices/${id}`),
  create: (deviceData) => api.post('/devices', deviceData),
  update: (id, deviceData) => api.put(`/devices/${id}`, deviceData),
  delete: (id) => api.delete(`/devices/${id}`),
};