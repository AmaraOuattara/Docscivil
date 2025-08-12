import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  ActivityIndicator,
  Searchbar,
  FAB,
  Chip,
  IconButton,
  Menu,
  Divider,
} from 'react-native-paper';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../theme/theme';
import { prospectService } from '../../services/api';

const ProspectsScreen = ({ navigation }) => {
  const [prospects, setProspects] = useState([]);
  const [filteredProspects, setFilteredProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    loadProspects();
  }, []);

  useEffect(() => {
    filterProspects();
  }, [searchQuery, prospects]);

  const loadProspects = async () => {
    try {
      setLoading(true);
      const response = await prospectService.getAll();
      setProspects(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des prospects:', error);
      Alert.alert('Erreur', 'Impossible de charger les prospects');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProspects();
    setRefreshing(false);
  };

  const filterProspects = () => {
    if (!searchQuery.trim()) {
      setFilteredProspects(prospects);
      return;
    }

    const filtered = prospects.filter(prospect =>
      prospect.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.phone?.includes(searchQuery)
    );
    setFilteredProspects(filtered);
  };

  const handleProspectAction = (action, prospect) => {
    setSelectedProspect(prospect);
    setMenuVisible(false);
    
    switch (action) {
      case 'view':
        // Navigation vers la vue détaillée
        break;
      case 'edit':
        // Navigation vers l'édition
        break;
      case 'delete':
        confirmDeleteProspect(prospect);
        break;
    }
  };

  const confirmDeleteProspect = (prospect) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer le prospect ${prospect.firstName} ${prospect.lastName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteProspect(prospect.id),
        },
      ]
    );
  };

  const deleteProspect = async (id) => {
    try {
      await prospectService.delete(id);
      await loadProspects();
      Alert.alert('Succès', 'Prospect supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le prospect');
    }
  };

  const ProspectCard = ({ prospect }) => (
    <Card style={[styles.prospectCard, { backgroundColor: themeColors.surface }]}>
      <Card.Content>
        <View style={styles.prospectHeader}>
          <View style={styles.prospectInfo}>
            <Title style={[styles.prospectName, { color: themeColors.text }]}>
              {prospect.firstName} {prospect.lastName}
            </Title>
            <Paragraph style={[styles.prospectEmail, { color: themeColors.textSecondary }]}>
              {prospect.email}
            </Paragraph>
            {prospect.phone && (
              <Paragraph style={[styles.prospectPhone, { color: themeColors.textSecondary }]}>
                📞 {prospect.phone}
              </Paragraph>
            )}
          </View>
          <Menu
            visible={menuVisible && selectedProspect?.id === prospect.id}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuAnchor}
          >
            <Menu.Item
              onPress={() => handleProspectAction('view', prospect)}
              title="Voir les détails"
              leadingIcon="eye"
            />
            <Menu.Item
              onPress={() => handleProspectAction('edit', prospect)}
              title="Modifier"
              leadingIcon="pencil"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleProspectAction('delete', prospect)}
              title="Supprimer"
              leadingIcon="delete"
              titleStyle={{ color: themeColors.error }}
            />
          </Menu>
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={(event) => {
              setSelectedProspect(prospect);
              setMenuAnchor(event.target);
              setMenuVisible(true);
            }}
          />
        </View>
        
        <View style={styles.prospectDetails}>
          {prospect.juridiction && (
            <Chip
              icon="gavel"
              style={[styles.detailChip, { backgroundColor: themeColors.primaryLight }]}
              textStyle={{ color: themeColors.primary }}
            >
              {prospect.juridiction.name}
            </Chip>
          )}
          {prospect.zone && (
            <Chip
              icon="map"
              style={[styles.detailChip, { backgroundColor: themeColors.accent }]}
              textStyle={{ color: 'white' }}
            >
              {prospect.zone.name}
            </Chip>
          )}
          {prospect.commune && (
            <Chip
              icon="location-city"
              style={[styles.detailChip, { backgroundColor: themeColors.success }]}
              textStyle={{ color: 'white' }}
            >
              {prospect.commune.name}
            </Chip>
          )}
        </View>

        {prospect.notes && (
          <View style={styles.notesContainer}>
            <Text style={[styles.notesLabel, { color: themeColors.textSecondary }]}>
              Notes :
            </Text>
            <Text style={[styles.notesText, { color: themeColors.text }]}>
              {prospect.notes}
            </Text>
          </View>
        )}

        <View style={styles.prospectFooter}>
          <Text style={[styles.createdAt, { color: themeColors.textSecondary }]}>
            Créé le {new Date(prospect.createdAt).toLocaleDateString('fr-FR')}
          </Text>
          <View style={styles.statusContainer}>
            <Chip
              icon={prospect.status === 'active' ? 'check-circle' : 'pause-circle'}
              style={[
                styles.statusChip,
                {
                  backgroundColor: prospect.status === 'active' ? themeColors.success : themeColors.warning,
                },
              ]}
              textStyle={{ color: 'white' }}
            >
              {prospect.status === 'active' ? 'Actif' : 'Inactif'}
            </Chip>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
          Chargement des prospects...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* En-tête avec recherche */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher un prospect..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: themeColors.surface }]}
          iconColor={themeColors.primary}
        />
        <Button
          mode="contained"
          onPress={() => {/* Navigation vers l'ajout */}}
          style={[styles.addButton, { backgroundColor: themeColors.primary }]}
          icon="plus"
        >
          Ajouter
        </Button>
      </View>

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.primary }]}>
              {prospects.length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Total
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.success }]}>
              {prospects.filter(p => p.status === 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Actifs
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.warning }]}>
              {prospects.filter(p => p.status !== 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Inactifs
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Liste des prospects */}
      <ScrollView
        style={styles.prospectsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredProspects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
              {searchQuery ? 'Aucun prospect trouvé' : 'Aucun prospect pour le moment'}
            </Text>
            {!searchQuery && (
              <Button
                mode="outlined"
                onPress={() => {/* Navigation vers l'ajout */}}
                style={styles.emptyStateButton}
                icon="plus"
              >
                Ajouter le premier prospect
              </Button>
            )}
          </View>
        ) : (
          filteredProspects.map((prospect) => (
            <ProspectCard key={prospect.id} prospect={prospect} />
          ))
        )}
      </ScrollView>

      {/* FAB pour ajouter rapidement */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: themeColors.primary }]}
        onPress={() => {/* Navigation vers l'ajout */}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    elevation: 2,
  },
  addButton: {
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
  },
  statContent: {
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  prospectsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  prospectCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  prospectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  prospectInfo: {
    flex: 1,
  },
  prospectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  prospectEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  prospectPhone: {
    fontSize: 14,
  },
  prospectDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailChip: {
    marginBottom: 4,
  },
  notesContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  prospectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdAt: {
    fontSize: 12,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusChip: {
    height: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyStateButton: {
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ProspectsScreen;