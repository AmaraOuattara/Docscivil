import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, Button, FAB, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';
import { prospectService } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalProspects: 0,
    prospectsEnCours: 0,
    prospectsTermines: 0,
    prospectsEnAttente: 0,
  });
  const [recentProspects, setRecentProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const paperTheme = useTheme();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Charger les statistiques des prospects
      const prospectsResponse = await prospectService.getAll({ page: 1, size: 1000 });
      if (prospectsResponse.data.code === '200') {
        const prospects = prospectsResponse.data.content;
        const total = prospects.length;
        const enCours = prospects.filter(p => p.Statut_client === 'EN_COURS').length;
        const termines = prospects.filter(p => p.Statut_client === 'TERMINE').length;
        const enAttente = prospects.filter(p => p.Statut_client === 'EN_ATTENTE').length;

        setStats({
          totalProspects: total,
          prospectsEnCours: enCours,
          prospectsTermines: termines,
          prospectsEnAttente: enAttente,
        });

        // Récupérer les 5 prospects les plus récents
        const recent = prospects
          .sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation))
          .slice(0, 5);
        setRecentProspects(recent);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_COURS':
        return theme.colors.warning;
      case 'TERMINE':
        return theme.colors.success;
      case 'EN_ATTENTE':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'EN_COURS':
        return 'En cours';
      case 'TERMINE':
        return 'Terminé';
      case 'EN_ATTENTE':
        return 'En attente';
      default:
        return status;
    }
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.statCardContainer}>
      <Card style={[styles.statCard, { borderLeftColor: color }]}>
        <Card.Content style={styles.statCardContent}>
          <View style={styles.statIconContainer}>
            <Ionicons name={icon} size={32} color={color} />
          </View>
          <View style={styles.statTextContainer}>
            <Title style={styles.statValue}>{value}</Title>
            <Paragraph style={styles.statTitle}>{title}</Paragraph>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, description, icon, color, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionContainer}>
      <Card style={styles.quickActionCard}>
        <Card.Content style={styles.quickActionContent}>
          <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
            <Ionicons name={icon} size={24} color="white" />
          </View>
          <View style={styles.quickActionText}>
            <Title style={styles.quickActionTitle}>{title}</Title>
            <Paragraph style={styles.quickActionDescription}>{description}</Paragraph>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header de bienvenue */}
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeTextContainer}>
            <Title style={styles.welcomeTitle}>
              Bonjour, {user?.Usr_Prenom || 'Utilisateur'} !
            </Title>
            <Paragraph style={styles.welcomeSubtitle}>
              Bienvenue sur votre tableau de bord DocsCivil CI
            </Paragraph>
          </View>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={32} color={theme.colors.primary} />
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.statsSection}>
          <Title style={styles.sectionTitle}>Vue d'ensemble</Title>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Prospects"
              value={stats.totalProspects}
              icon="people"
              color={theme.colors.primary}
              onPress={() => navigation.navigate('Prospects')}
            />
            <StatCard
              title="En cours"
              value={stats.prospectsEnCours}
              icon="time"
              color={theme.colors.warning}
              onPress={() => navigation.navigate('Prospects')}
            />
            <StatCard
              title="Terminés"
              value={stats.prospectsTermines}
              icon="checkmark-circle"
              color={theme.colors.success}
              onPress={() => navigation.navigate('Prospects')}
            />
            <StatCard
              title="En attente"
              value={stats.prospectsEnAttente}
              icon="hourglass"
              color={theme.colors.info}
              onPress={() => navigation.navigate('Prospects')}
            />
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickActionsSection}>
          <Title style={styles.sectionTitle}>Actions rapides</Title>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              title="Nouveau prospect"
              description="Ajouter un nouveau prospect"
              icon="person-add"
              color={theme.colors.primary}
              onPress={() => navigation.navigate('Prospects')}
            />
            <QuickActionCard
              title="Scanner QR"
              description="Scanner un code QR"
              icon="qr-code"
              color={theme.colors.accent}
              onPress={() => navigation.navigate('ScanQR')}
            />
            <QuickActionCard
              title="Appareil photo"
              description="Prendre une photo"
              icon="camera"
              color={theme.colors.success}
              onPress={() => navigation.navigate('Camera')}
            />
            <QuickActionCard
              title="Documents"
              description="Gérer les documents"
              icon="document-text"
              color={theme.colors.info}
              onPress={() => navigation.navigate('Documents')}
            />
          </View>
        </View>

        {/* Prospects récents */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Title style={styles.sectionTitle}>Prospects récents</Title>
            <TouchableOpacity onPress={() => navigation.navigate('Prospects')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {recentProspects.length > 0 ? (
            recentProspects.map((prospect, index) => (
              <Card key={prospect.id || index} style={styles.prospectCard}>
                <Card.Content style={styles.prospectCardContent}>
                  <View style={styles.prospectInfo}>
                    <Title style={styles.prospectName}>
                      {prospect.clt_nom} {prospect.clt_prenom}
                    </Title>
                    <Paragraph style={styles.prospectContact}>
                      {prospect.clt_contact}
                    </Paragraph>
                    <Paragraph style={styles.prospectReference}>
                      Ref: {prospect.clt_reference}
                    </Paragraph>
                  </View>
                  <View style={styles.prospectStatus}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(prospect.Statut_client) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusText(prospect.Statut_client)}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyCardContent}>
                <Ionicons name="people-outline" size={48} color={theme.colors.textSecondary} />
                <Paragraph style={styles.emptyText}>
                  Aucun prospect pour le moment
                </Paragraph>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Prospects')}
                  style={styles.emptyButton}
                >
                  Ajouter un prospect
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* FAB pour ajouter un prospect */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('Prospects')}
        label="Nouveau prospect"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  statsSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCardContainer: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    ...theme.shadows.small,
  },
  statCardContent: {
    padding: theme.spacing.md,
  },
  statIconContainer: {
    marginBottom: theme.spacing.sm,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  quickActionsSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionContainer: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  quickActionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  quickActionContent: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    alignItems: 'center',
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: theme.spacing.md,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  prospectCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  prospectCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  prospectInfo: {
    flex: 1,
  },
  prospectName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  prospectContact: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  prospectReference: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  prospectStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  emptyCardContent: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  emptyButton: {
    borderColor: theme.colors.primary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});