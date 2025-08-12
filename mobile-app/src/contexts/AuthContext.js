import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@DocsCivil:token');
      const storedUser = await AsyncStorage.getItem('@DocsCivil:user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        
        // Configurer le token dans l'API
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'authentification:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (contact, password) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/login', {
        Usr_Contact: contact,
        Usr_Password: password,
      });

      if (response.data.code === '201') {
        const { token: newToken, content: userData } = response.data;
        
        // Sauvegarder les données
        await AsyncStorage.setItem('@DocsCivil:token', newToken);
        await AsyncStorage.setItem('@DocsCivil:user', JSON.stringify(userData));
        
        // Mettre à jour l'état
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Configurer le token dans l'API
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        return { success: true };
      } else {
        return { success: false, error: response.data.error || 'Erreur de connexion' };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erreur de connexion au serveur' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/register', userData);

      if (response.data.code === '201') {
        const { token: newToken, content: newUser } = response.data;
        
        // Sauvegarder les données
        await AsyncStorage.setItem('@DocsCivil:token', newToken);
        await AsyncStorage.setItem('@DocsCivil:user', JSON.stringify(newUser));
        
        // Mettre à jour l'état
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Configurer le token dans l'API
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        return { success: true };
      } else {
        return { success: false, error: response.data.error || 'Erreur d\'inscription' };
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erreur d\'inscription au serveur' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Supprimer les données stockées
      await AsyncStorage.removeItem('@DocsCivil:token');
      await AsyncStorage.removeItem('@DocsCivil:user');
      
      // Réinitialiser l'état
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Supprimer le token de l'API
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      setUser(updatedUserData);
      await AsyncStorage.setItem('@DocsCivil:user', JSON.stringify(updatedUserData));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};