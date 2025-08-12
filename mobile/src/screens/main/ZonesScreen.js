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
import { zoneService } from '../../services/api';

const ZonesScreen = ({ navigation }) => {
  const [zones, setZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    loadZones();
  }, []);

  useEffect(() => {
    filterZones();
  }, [searchQuery, zones]);

  const loadZones = async () => {
    try {
      setLoading(true);
      const response = await zoneService.getAll();
      setZones(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des zones:', error);
      Alert.alert('Erreur', 'Impossible de charger les zones');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadZones();
    setRefreshing(false);
  };

  const filterZones = () => {
    if (!searchQuery.trim()) {
      setFilteredZones(zones);
      return;
    }

    const filtered = zones.filter(zone =>
      zone.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.region?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredZones(filtered);
  };

  const handleZoneAction = (action, zone) => {
    setSelectedZone(zone);
    setMenuVisible(false);
    
    switch (action) {
      case 'view':
        // Navigation vers la vue détaillée
        break;
      case 'edit':
        // Navigation vers l'édition
        break;
      case 'delete':
        confirmDeleteZone(zone);
        break;
    }
  };

  const confirmDeleteZone = (zone) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer la zone "${zone.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteZone(zone.id),
        },
      ]
    );
  };

  const deleteZone = async (id) => {
    try {
      await zoneService.delete(id);
      await loadZones();
      Alert.alert('Succès', 'Zone supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer la zone');
    }
  };

  const ZoneCard = ({ zone }) => (
    <Card style={[styles.zoneCard, { backgroundColor: themeColors.surface }]}>
      <Card.Content>
        <View style={styles.zoneHeader}>
          <View style={styles.zoneInfo}>
            <Title style={[styles.zoneName, { color: themeColors.text }]}>
              {zone.name}
            </Title>
            {zone.description && (
              <Paragraph style={[styles.zoneDescription, { color: themeColors.textSecondary }]}>
                {zone.description}
              </Paragraph>
            )}
          </View>
          <Menu
            visible={menuVisible && selectedZone?.id === zone.id}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuAnchor}
          >
            <Menu.Item
              onPress={() => handleZoneAction('view', zone)}
              title="Voir les détails"
              leadingIcon="eye"
            />
            <Menu.Item
              onPress={() => handleZoneAction('edit', zone)}
              title="Modifier"
              leadingIcon="pencil"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleZoneAction('delete', zone)}
              title="Supprimer"
              leadingIcon="delete"
              titleStyle={{ color: themeColors.error }}
            />
          </Menu>
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={(event) => {
              setSelectedZone(zone);
              setMenuAnchor(event.target);
              setMenuVisible(true);
            }}
          />
        </View>
        
        <View style={styles.zoneDetails}>
          {zone.region && (
            <Chip
              icon="map"
              style={[styles.detailChip, { backgroundColor: themeColors.primaryLight }]}
              textStyle={{ color: themeColors.primary }}
            >
              {zone.region}
            </Chip>
          )}
          {zone.type && (
            <Chip
              icon="category"
              style={[styles.detailChip, { backgroundColor: themeColors.accent }]}
              textStyle={{ color: 'white' }}
            >
              {zone.type}
            </Chip>
          )}
          {zone.population && (
            <Chip
              icon="people"
              style={[styles.detailChip, { backgroundColor: themeColors.success }]}
              textStyle={{ color: 'white' }}
            >
              {zone.population.toLocaleString()} hab.
            </Chip>
          )}
        </View>

        <View style={styles.zoneFooter}>
          <Text style={[styles.createdAt, { color: themeColors.textSecondary }]}>
            Créé le {new Date(zone.createdAt).toLocaleDateString('fr-FR')}
          </Text>
          <View style={styles.statusContainer}>
            <Chip
              icon={zone.status === 'active' ? 'check-circle' : 'pause-circle'}
              style={[
                styles.statusChip,
                {
                  backgroundColor: zone.status === 'active' ? themeColors.success : themeColors.warning,
                },
              ]}
              textStyle={{ color: 'white' }}
            >
              {zone.status === 'active' ? 'Active' : 'Inactive'}
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
          Chargement des zones...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* En-tête avec recherche */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher une zone..."
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
              {zones.length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Total
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.success }]}>
              {zones.filter(z => z.status === 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Actives
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.warning }]}>
              {zones.filter(z => z.status !== 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Inactives
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Liste des zones */}
      <ScrollView
        style={styles.zonesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredZones.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
              {searchQuery ? 'Aucune zone trouvée' : 'Aucune zone pour le moment'}
            </Text>
            {!searchQuery && (
              <Button
                mode="outlined"
                onPress={() => {/* Navigation vers l'ajout */}}
                style={styles.emptyStateButton}
                icon="plus"
              >
                Ajouter la première zone
              </Button>
            )}
          </View>
        ) : (
          filteredZones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
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
  zonesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  zoneCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  zoneDescription: {
    fontSize: 14,
  },
  zoneDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailChip: {
    marginBottom: 4,
  },
  zoneFooter: {
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

export default ZonesScreen;