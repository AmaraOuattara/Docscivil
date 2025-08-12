import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Écrans principaux
import DashboardScreen from '../screens/main/DashboardScreen';
import ProspectsScreen from '../screens/main/ProspectsScreen';
import JuridictionsScreen from '../screens/main/JuridictionsScreen';
import ZonesScreen from '../screens/main/ZonesScreen';
import CommunesScreen from '../screens/main/CommunesScreen';
import LocalitesScreen from '../screens/main/LocalitesScreen';
import EtatsScreen from '../screens/main/EtatsScreen';
import TypeCopiesScreen from '../screens/main/TypeCopiesScreen';
import ListeDiffusionsScreen from '../screens/main/ListeDiffusionsScreen';
import DevicesScreen from '../screens/main/DevicesScreen';
import UsersScreen from '../screens/main/UsersScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Composants personnalisés
import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Navigateur des onglets pour le tableau de bord
const DashboardTabNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Prospects') {
            iconName = 'people';
          } else if (route.name === 'Juridictions') {
            iconName = 'gavel';
          } else if (route.name === 'Zones') {
            iconName = 'map';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.divider,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Tableau de bord' }}
      />
      <Tab.Screen 
        name="Prospects" 
        component={ProspectsScreen}
        options={{ title: 'Prospects' }}
      />
      <Tab.Screen 
        name="Juridictions" 
        component={JuridictionsScreen}
        options={{ title: 'Juridictions' }}
      />
      <Tab.Screen 
        name="Zones" 
        component={ZonesScreen}
        options={{ title: 'Zones' }}
      />
    </Tab.Navigator>
  );
};

// Navigateur principal avec menu latéral
const MainNavigator = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: colors.surface,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
      }}
    >
      <Drawer.Screen 
        name="DashboardTab" 
        component={DashboardTabNavigator}
        options={{ 
          title: 'Tableau de bord',
          drawerIcon: ({ color, size }) => (
            <Icon name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Communes" 
        component={CommunesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="location-city" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Localites" 
        component={LocalitesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="place" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Etats" 
        component={EtatsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="flag" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="TypeCopies" 
        component={TypeCopiesScreen}
        options={{
          title: 'Types de copies',
          drawerIcon: ({ color, size }) => (
            <Icon name="description" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="ListeDiffusions" 
        component={ListeDiffusionsScreen}
        options={{
          title: 'Listes de diffusion',
          drawerIcon: ({ color, size }) => (
            <Icon name="list" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Devices" 
        component={DevicesScreen}
        options={{
          title: 'Appareils',
          drawerIcon: ({ color, size }) => (
            <Icon name="devices" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Users" 
        component={UsersScreen}
        options={{
          title: 'Utilisateurs',
          drawerIcon: ({ color, size }) => (
            <Icon name="people" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profil',
          drawerIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigator;