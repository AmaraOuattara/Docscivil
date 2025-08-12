import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, TYPOGRAPHY, SPACING, CONFIG } from '../../constants/config';
import ApiService from '../../services/apiService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProspects: 0,
    activeProspects: 0,
    recentDocuments: 0,
    pendingTasks: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadUserData();
    loadDashboardData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load prospects data for statistics
      const prospectsResponse = await ApiService.getProspects(1, 100);
      if (prospectsResponse.data) {
        const prospects = prospectsResponse.data;
        const activeProspects = prospects.filter(p => p.Statut_client === 'ACTIF');
        
        setStats(prev => ({
          ...prev,
          totalProspects: prospects.length,
          activeProspects: activeProspects.length,
          recentDocuments: Math.floor(Math.random() * 25) + 5, // Mock data
          pendingTasks: Math.floor(Math.random() * 10) + 2, // Mock data
        }));

        // Set recent activity (last 5 prospects)
        setRecentActivity(prospects.slice(0, 5));
      }
    } catch (error) {
      console.log('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statCardContent}>
        <View style={styles.statCardLeft}>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={styles.statCardValue}>{value}</Text>
        </View>
        <View style={[styles.statCardIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, description, icon, color, onPress }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDescription}>{description}</Text>
    </TouchableOpacity>
  );

  const ActivityItem = ({ prospect, index }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons name="person-circle-outline" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>
          {prospect.clt_nom} {prospect.clt_prenom}
        </Text>
        <Text style={styles.activityDescription}>
          Contact: {prospect.clt_contact}
        </Text>
        <Text style={styles.activityTime}>
          Ajouté le {new Date(prospect.date_creation).toLocaleDateString('fr-FR')}
        </Text>
      </View>
      <View style={[
        styles.statusBadge,
        { backgroundColor: prospect.Statut_client === 'ACTIF' ? COLORS.success + '20' : COLORS.warning + '20' }
      ]}>
        <Text style={[
          styles.statusText,
          { color: prospect.Statut_client === 'ACTIF' ? COLORS.success : COLORS.warning }
        ]}>
          {prospect.Statut_client}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>
              {getGreeting()}, {user?.Usr_Prenom || 'Utilisateur'} !
            </Text>
            <Text style={styles.subtitle}>
              Voici un aperçu de votre activité
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Prospects"
            value={stats.totalProspects}
            icon="people-outline"
            color={COLORS.primary}
            onPress={() => navigation.navigate('Prospects')}
          />
          <StatCard
            title="Prospects Actifs"
            value={stats.activeProspects}
            icon="checkmark-circle-outline"
            color={COLORS.success}
            onPress={() => navigation.navigate('Prospects')}
          />
          <StatCard
            title="Documents"
            value={stats.recentDocuments}
            icon="document-text-outline"
            color={COLORS.info}
            onPress={() => navigation.navigate('Documents')}
          />
          <StatCard
            title="Tâches en cours"
            value={stats.pendingTasks}
            icon="time-outline"
            color={COLORS.warning}
            onPress={() => {}}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              title="Ajouter Prospect"
              description="Créer un nouveau prospect"
              icon="person-add-outline"
              color={COLORS.primary}
              onPress={() => navigation.navigate('ProspectForm')}
            />
            <QuickActionCard
              title="Localités"
              description="Gérer les localités"
              icon="location-outline"
              color={COLORS.secondary}
              onPress={() => navigation.navigate('Locations')}
            />
            <QuickActionCard
              title="Documents"
              description="Voir les documents"
              icon="folder-outline"
              color={COLORS.info}
              onPress={() => navigation.navigate('Documents')}
            />
            <QuickActionCard
              title="Profil"
              description="Modifier le profil"
              icon="settings-outline"
              color={COLORS.accent}
              onPress={() => navigation.navigate('Profile')}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          <View style={styles.activityContainer}>
            {recentActivity.length > 0 ? (
              recentActivity.map((prospect, index) => (
                <ActivityItem key={prospect.Id_clt} prospect={prospect} index={index} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="information-circle-outline" size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyStateText}>Aucune activité récente</Text>
              </View>
            )}
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  statsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCardLeft: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statCardValue: {
    fontSize: TYPOGRAPHY.fontSizes.xxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.text,
  },
  statCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  actionDescription: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityIcon: {
    marginRight: SPACING.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  activityDescription: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  activityTime: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});

export default HomeScreen;