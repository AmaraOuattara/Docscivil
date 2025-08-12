import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, TYPOGRAPHY, SPACING, CONFIG } from '../../constants/config';
import ApiService from '../../services/apiService';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.log('Logout error:', error);
    }
    // Navigation will be handled automatically by AppNavigator
  };

  const ProfileItem = ({ icon, title, value, onPress }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.profileItemTitle}>{title}</Text>
      </View>
      <View style={styles.profileItemRight}>
        <Text style={styles.profileItemValue}>{value}</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const ActionItem = ({ icon, title, color = COLORS.text, onPress }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.actionItemTitle, { color }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement du profil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.Usr_Nom?.charAt(0)}{user?.Usr_Prenom?.charAt(0)}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.Usr_Nom} {user?.Usr_Prenom}
          </Text>
          <Text style={styles.userEmail}>{user?.Usr_Email}</Text>
          <Text style={styles.userReference}>Réf: {user?.Usr_reference}</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.card}>
            <ProfileItem
              icon="person-outline"
              title="Nom complet"
              value={`${user?.Usr_Nom} ${user?.Usr_Prenom}`}
              onPress={() => {}}
            />
            <ProfileItem
              icon="mail-outline"
              title="Email"
              value={user?.Usr_Email}
              onPress={() => {}}
            />
            <ProfileItem
              icon="call-outline"
              title="Contact"
              value={user?.Usr_Contact || 'Non renseigné'}
              onPress={() => {}}
            />
            <ProfileItem
              icon="location-outline"
              title="Localité"
              value={user?.Loc_reference || 'Non renseignée'}
              onPress={() => {}}
            />
            <ProfileItem
              icon="card-outline"
              title="Type de compte"
              value={user?.Ref_TypeCompte || 'Standard'}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Prospects</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Documents</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {user?.Usr_Gain || '0'}
              </Text>
              <Text style={styles.statLabel}>Gains</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.card}>
            <ActionItem
              icon="create-outline"
              title="Modifier le profil"
              onPress={() => {}}
            />
            <ActionItem
              icon="notifications-outline"
              title="Notifications"
              onPress={() => {}}
            />
            <ActionItem
              icon="shield-checkmark-outline"
              title="Sécurité"
              onPress={() => {}}
            />
            <ActionItem
              icon="help-circle-outline"
              title="Aide & Support"
              onPress={() => {}}
            />
            <ActionItem
              icon="information-circle-outline"
              title="À propos"
              onPress={() => {}}
            />
            <ActionItem
              icon="log-out-outline"
              title="Déconnexion"
              color={COLORS.error}
              onPress={handleLogout}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>DocsCivil v1.0.0</Text>
          <Text style={styles.footerText}>
            Connecté depuis le {new Date(user?.date_creation).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSizes.xxxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.surface,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  userReference: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  profileItemTitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.text,
    flex: 1,
  },
  profileItemValue: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionItemTitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    flex: 1,
    marginLeft: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
});

export default ProfileScreen;