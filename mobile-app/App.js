import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import des écrans
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProspectsScreen from './src/screens/ProspectsScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ScanQRScreen from './src/screens/ScanQRScreen';
import CameraScreen from './src/screens/CameraScreen';

// Import du contexte d'authentification
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Import du thème
import { theme } from './src/theme/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Navigation des onglets principaux
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Accueil') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Prospects') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Documents') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Prospects" component={ProspectsScreen} />
      <Tab.Screen name="Documents" component={DocumentsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navigation du drawer
function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ 
          title: 'DocsCivil CI',
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Paramètres',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }} 
      />
    </Drawer.Navigator>
  );
}

// Navigation principale
function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Écrans d'authentification
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // Écrans principaux
        <>
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
          <Stack.Screen name="ScanQR" component={ScanQRScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}