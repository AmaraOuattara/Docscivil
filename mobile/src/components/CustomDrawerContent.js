import React from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Drawer,
  Text,
  Avatar,
  Divider,
  Switch,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { colors } from '../theme/theme';

const CustomDrawerContent = (props) => {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { colors: themeColors } = useTheme();

  const handleSignOut = () => {
    signOut();
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.surface }]}>
      {/* En-tête avec informations utilisateur */}
      <View style={[styles.header, { backgroundColor: themeColors.primary }]}>
        <Avatar.Text
          size={60}
          label={getInitials(user?.firstName, user?.lastName)}
          style={styles.avatar}
          color={themeColors.primary}
        />
        <Text style={[styles.userName, { color: themeColors.surface }]}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={[styles.userEmail, { color: themeColors.surface }]}>
          {user?.email}
        </Text>
      </View>

      <Divider style={[styles.divider, { backgroundColor: themeColors.divider }]} />

      {/* Options du menu */}
      <Drawer.Section style={styles.drawerSection}>
        <Drawer.Item
          icon="dashboard"
          label="Tableau de bord"
          onPress={() => props.navigation.navigate('DashboardTab')}
          active={props.state.index === 0}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <Drawer.Item
          icon="people"
          label="Prospects"
          onPress={() => props.navigation.navigate('Prospects')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <Drawer.Item
          icon="gavel"
          label="Juridictions"
          onPress={() => props.navigation.navigate('Juridictions')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <Drawer.Item
          icon="map"
          label="Zones"
          onPress={() => props.navigation.navigate('Zones')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <Drawer.Item
          icon="location-city"
          label="Communes"
          onPress={() => props.navigation.navigate('Communes')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <Drawer.Item
          icon="place"
          label="Localités"
          onPress={() => props.navigation.navigate('Localites')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <Drawer.Item
          icon="flag"
          label="États"
          onPress={() => props.navigation.navigate('Etats')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <Drawer.Item
          icon="description"
          label="Types de copies"
          onPress={() => props.navigation.navigate('TypeCopies')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <Drawer.Item
          icon="list"
          label="Listes de diffusion"
          onPress={() => props.navigation.navigate('ListeDiffusions')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <Drawer.Item
          icon="devices"
          label="Appareils"
          onPress={() => props.navigation.navigate('Devices')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <Drawer.Item
          icon="people"
          label="Utilisateurs"
          onPress={() => props.navigation.navigate('Users')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
      </Drawer.Section>

      <Divider style={[styles.divider, { backgroundColor: themeColors.divider }]} />

      {/* Section des préférences */}
      <Drawer.Section style={styles.drawerSection}>
        <Drawer.Item
          icon="person"
          label="Profil"
          onPress={() => props.navigation.navigate('Profile')}
          activeTintColor={themeColors.primary}
          inactiveTintColor={themeColors.text}
        />
        <View style={styles.themeToggle}>
          <Drawer.Item
            icon="brightness-6"
            label="Mode sombre"
            onPress={() => {}}
            activeTintColor={themeColors.primary}
            inactiveTintColor={themeColors.text}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                color={themeColors.primary}
              />
            )}
          />
        </View>
      </Drawer.Section>

      <Divider style={[styles.divider, { backgroundColor: themeColors.divider }]} />

      {/* Bouton de déconnexion */}
      <Drawer.Section style={styles.drawerSection}>
        <Drawer.Item
          icon="logout"
          label="Déconnexion"
          onPress={handleSignOut}
          activeTintColor={themeColors.error}
          inactiveTintColor={themeColors.error}
        />
      </Drawer.Section>

      {/* Informations de version */}
      <View style={styles.footer}>
        <Text style={[styles.versionText, { color: themeColors.textSecondary }]}>
          DocsCivil v1.0.0
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.9,
  },
  divider: {
    height: 1,
  },
  drawerSection: {
    marginTop: 0,
  },
  themeToggle: {
    marginRight: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 'auto',
  },
  versionText: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default CustomDrawerContent;