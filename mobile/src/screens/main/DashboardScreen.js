import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';
import {
  prospectService,
  juridictionService,
  zoneService,
  communeService,
} from '../../services/api';

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    prospects: 0,
    juridictions: 0,
    zones: 0,
    communes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { colors: themeColors } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [
        prospectsResponse,
        juridictionsResponse,
        zonesResponse,
        communesResponse,
      ] = await Promise.all([
        prospectService.getAll(),
        juridictionService.getAll(),
        zoneService.getAll(),
        communeService.getAll(),
      ]);

      setStats({
        prospects: prospectsResponse.data?.length || 0,
        juridictions: juridictionsResponse.data?.length || 0,
        zones: zonesResponse.data?.length || 0,
        communes: communesResponse.data?.length || 0,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <Card
      style={[styles.statCard, { backgroundColor: themeColors.surface }]}
      onPress={onPress}
    >
      <Card.Content style={styles.statCardContent}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Text style={styles.statIconText}>{icon}</Text>
        </View>
        <View style={styles.statInfo}>
          <Title style={[styles.statValue, { color: themeColors.text }]}>
            {value}
          </Title>
          <Paragraph style={[styles.statLabel, { color: themeColors.textSecondary }]}>
            {title}
          </Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon, onPress, color }) => (
    <Card
      style={[styles.quickActionCard, { backgroundColor: themeColors.surface }]}
      onPress={onPress}
    >
      <Card.Content style={styles.quickActionContent}>
        <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
          <Text style={styles.quickActionIconText}>{icon}</Text>
        </View>
        <View style={styles.quickActionInfo}>
          <Title style={[styles.quickActionTitle, { color: themeColors.text }]}>
            {title}
          </Title>
          <Paragraph style={[styles.quickActionDescription, { color: themeColors.textSecondary }]}>
            {description}
          </Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
          Chargement du tableau de bord...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* En-tête de bienvenue */}
      <Card style={[styles.welcomeCard, { backgroundColor: themeColors.primary }]}>
        <Card.Content>
          <Title style={[styles.welcomeTitle, { color: themeColors.surface }]}>
            Bonjour, {user?.firstName} !
          </Title>
          <Paragraph style={[styles.welcomeSubtitle, { color: themeColors.surface }]}>
            Bienvenue dans votre tableau de bord DocsCivil
          </Paragraph>
          <Chip
            icon="calendar-today"
            style={[styles.dateChip, { backgroundColor: themeColors.surface }]}
            textStyle={{ color: themeColors.primary }}
          >
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Chip>
        </Card.Content>
      </Card>

      {/* Statistiques */}
      <View style={styles.statsSection}>
        <Title style={[styles.sectionTitle, { color: themeColors.text }]}>
          Statistiques
        </Title>
        <View style={styles.statsGrid}>
          <StatCard
            title="Prospects"
            value={stats.prospects}
            icon="👥"
            color="#4CAF50"
            onPress={() => navigation.navigate('Prospects')}
          />
          <StatCard
            title="Juridictions"
            value={stats.juridictions}
            icon="⚖️"
            color="#2196F3"
            onPress={() => navigation.navigate('Juridictions')}
          />
          <StatCard
            title="Zones"
            value={stats.zones}
            icon="🗺️"
            color="#FF9800"
            onPress={() => navigation.navigate('Zones')}
          />
          <StatCard
            title="Communes"
            value={stats.communes}
            icon="🏘️"
            color="#9C27B0"
            onPress={() => navigation.navigate('Communes')}
          />
        </View>
      </View>

      {/* Actions rapides */}
      <View style={styles.quickActionsSection}>
        <Title style={[styles.sectionTitle, { color: themeColors.text }]}>
          Actions rapides
        </Title>
        <QuickActionCard
          title="Ajouter un prospect"
          description="Créer un nouveau prospect dans le système"
          icon="➕"
          color="#4CAF50"
          onPress={() => navigation.navigate('Prospects')}
        />
        <QuickActionCard
          title="Gérer les juridictions"
          description="Consulter et modifier les juridictions"
          icon="⚖️"
          color="#2196F3"
          onPress={() => navigation.navigate('Juridictions')}
        />
        <QuickActionCard
          title="Configurer les zones"
          description="Définir et organiser les zones géographiques"
          icon="🗺️"
          color="#FF9800"
          onPress={() => navigation.navigate('Zones')}
        />
      </View>

      {/* Informations système */}
      <View style={styles.systemInfoSection}>
        <Title style={[styles.sectionTitle, { color: themeColors.text }]}>
          Informations système
        </Title>
        <Card style={[styles.systemInfoCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content>
            <View style={styles.systemInfoRow}>
              <Text style={[styles.systemInfoLabel, { color: themeColors.textSecondary }]}>
                Version de l'application :
              </Text>
              <Text style={[styles.systemInfoValue, { color: themeColors.text }]}>
                1.0.0
              </Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={[styles.systemInfoLabel, { color: themeColors.textSecondary }]}>
                Dernière connexion :
              </Text>
              <Text style={[styles.systemInfoValue, { color: themeColors.text }]}>
                {new Date().toLocaleString('fr-FR')}
              </Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={[styles.systemInfoLabel, { color: themeColors.textSecondary }]}>
                Statut de l'API :
              </Text>
              <Chip
                icon="check-circle"
                style={[styles.statusChip, { backgroundColor: '#4CAF50' }]}
                textStyle={{ color: 'white' }}
              >
                Connecté
              </Chip>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  welcomeCard: {
    marginBottom: 24,
    borderRadius: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  dateChip: {
    alignSelf: 'flex-start',
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statIconText: {
    fontSize: 24,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionIconText: {
    fontSize: 28,
  },
  quickActionInfo: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 14,
  },
  systemInfoSection: {
    marginBottom: 24,
  },
  systemInfoCard: {
    borderRadius: 12,
  },
  systemInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  systemInfoLabel: {
    fontSize: 14,
  },
  systemInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusChip: {
    height: 24,
  },
});

export default DashboardScreen;