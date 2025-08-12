import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG, ENDPOINTS } from '../constants/config';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: CONFIG.API_BASE_URL,
      timeout: CONFIG.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await this.clearAuth();
          // Redirect to login (you might want to use navigation here)
        }
        return Promise.reject(error);
      }
    );
  }

  async clearAuth() {
    await AsyncStorage.multiRemove([
      CONFIG.STORAGE_KEYS.USER_TOKEN,
      CONFIG.STORAGE_KEYS.USER_DATA,
    ]);
  }

  // Authentication methods
  async login(email, password) {
    try {
      const response = await this.api.post(ENDPOINTS.AUTH.LOGIN, {
        Usr_Email: email,
        Usr_Password: password,
      });
      
      if (response.data.token) {
        await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.USER_TOKEN, response.data.token);
        await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      const response = await this.api.post(ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      await this.api.post(ENDPOINTS.AUTH.LOGOUT);
      await this.clearAuth();
    } catch (error) {
      // Even if logout fails on server, clear local storage
      await this.clearAuth();
      throw this.handleError(error);
    }
  }

  // User methods
  async getUserProfile() {
    try {
      const response = await this.api.get(ENDPOINTS.USERS.PROFILE);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUserProfile(userData) {
    try {
      const response = await this.api.put(ENDPOINTS.USERS.UPDATE, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Prospect methods
  async getProspects(page = 1, limit = 10, search = '') {
    try {
      const response = await this.api.get(ENDPOINTS.PROSPECTS.LIST, {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProspect(prospectData) {
    try {
      const response = await this.api.post(ENDPOINTS.PROSPECTS.CREATE, prospectData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProspect(id, prospectData) {
    try {
      const response = await this.api.put(`${ENDPOINTS.PROSPECTS.UPDATE}/${id}`, prospectData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProspect(id) {
    try {
      const response = await this.api.delete(`${ENDPOINTS.PROSPECTS.DELETE}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Location methods
  async getCommunes() {
    try {
      const response = await this.api.get(ENDPOINTS.LOCATIONS.COMMUNES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getLocalites() {
    try {
      const response = await this.api.get(ENDPOINTS.LOCATIONS.LOCALITES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getZones() {
    try {
      const response = await this.api.get(ENDPOINTS.LOCATIONS.ZONES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getJuridictions() {
    try {
      const response = await this.api.get(ENDPOINTS.LOCATIONS.JURIDICTIONS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Document methods
  async getDocumentTypes() {
    try {
      const response = await this.api.get(ENDPOINTS.DOCUMENTS.TYPES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDocumentStates() {
    try {
      const response = await this.api.get(ENDPOINTS.DOCUMENTS.ETATS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Une erreur est survenue',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Problème de connexion réseau',
        status: 0
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Une erreur inattendue est survenue',
        status: -1
      };
    }
  }
}

export default new ApiService();