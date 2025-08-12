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
import { communeService } from '../../services/api';

const CommunesScreen = ({ navigation }) => {
  const [communes, setCommunes] = useState([]);
  const [filteredCommunes, setFilteredCommunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    loadCommunes();
  }, []);

  useEffect(() => {
    filterCommunes();
  }, [searchQuery, communes]);

  const loadCommunes = async () => {
    try {
      setLoading(true);
      const response = await communeService.getAll();
      setCommunes(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des communes:', error);
      Alert.alert('Erreur', 'Impossible de charger les communes');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCommunes();
    setRefreshing(false);
  };

  const filterCommunes = () => {
    if (!searchQuery.trim()) {
      setFilteredCommunes(communes);
      return;
    }

    const filtered = communes.filter(commune =>
      commune.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commune.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommunes(filtered);
  };

  const handleCommuneAction = (action, commune) => {
    setSelectedCommune(commune);
    setMenuVisible(false);
    
    switch (action) {
      case 'view':
        // Navigation vers la vue détaillée
        break;
      case 'edit':
        // Navigation vers l'édition
        break;
      case 'delete':
        confirmDeleteCommune(commune);
        break;
    }
  };

  const confirmDeleteCommune = (commune) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer la commune "${commune.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteCommune(commune.id),
        },
      ]
    );
  };

  const deleteCommune = async (id) => {
    try {
      await communeService.delete(id);
      await loadCommunes();
      Alert.alert('Succès', 'Commune supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer la commune');
    }
  };

  const CommuneCard = ({ commune }) => (
    <Card style={[styles.communeCard, { backgroundColor: themeColors.surface }]}>
      <Card.Content>
        <View style={styles.communeHeader}>
          <View style={styles.communeInfo}>
            <Title style={[styles.communeName, { color: themeColors.text }]}>
              {commune.name}
            </Title>
            {commune.code && (
              <Paragraph style={[styles.communeCode, { color: themeColors.textSecondary }]}>
                Code: {commune.code}
              </Paragraph>
            )}
          </View>
          <Menu
            visible={menuVisible && selectedCommune?.id === commune.id}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuAnchor}
          >
            <Menu.Item
              onPress={() => handleCommuneAction('view', commune)}
              title="Voir les détails"
              leadingIcon="eye"
            />
            <Menu.Item
              onPress={() => handleCommuneAction('edit', commune)}
              title="Modifier"
              leadingIcon="pencil"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleCommuneAction('delete', commune)}
              title="Supprimer"
              leadingIcon="delete"
              titleStyle={{ color: themeColors.error }}
            />
          </Menu>
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={(event) => {
              setSelectedCommune(commune);
              setMenuAnchor(event.target);
              setMenuVisible(true);
            }}
          />
        </View>
        
        <View style={styles.communeDetails}>
          {commune.department && (
            <Chip
              icon="map"
              style={[styles.detailChip, { backgroundColor: themeColors.primaryLight }]}
              textStyle={{ color: themeColors.primary }}
            >
              {commune.department}
            </Chip>
          )}
          {commune.region && (
            <Chip
              icon="flag"
              style={[styles.detailChip, { backgroundColor: themeColors.accent }]}
              textStyle={{ color: 'white' }}
            >
              {commune.region}
            </Chip>
          )}
        </View>

        <View style={styles.communeFooter}>
          <Text style={[styles.createdAt, { color: themeColors.textSecondary }]}>
            Créé le {new Date(commune.createdAt).toLocaleDateString('fr-FR')}
          </Text>
          <View style={styles.statusContainer}>
            <Chip
              icon={commune.status === 'active' ? 'check-circle' : 'pause-circle'}
              style={[
                styles.statusChip,
                {
                  backgroundColor: commune.status === 'active' ? themeColors.success : themeColors.warning,
                },
              ]}
              textStyle={{ color: 'white' }}
            >
              {commune.status === 'active' ? 'Active' : 'Inactive'}
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
          Chargement des communes...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* En-tête avec recherche */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher une commune..."
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
              {communes.length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Total
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.success }]}>
              {communes.filter(c => c.status === 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Actives
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.warning }]}>
              {communes.filter(c => c.status !== 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Inactives
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Liste des communes */}
      <ScrollView
        style={styles.communesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredCommunes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
              {searchQuery ? 'Aucune commune trouvée' : 'Aucune commune pour le moment'}
            </Text>
            {!searchQuery && (
              <Button
                mode="outlined"
                onPress={() => {/* Navigation vers l'ajout */}}
                style={styles.emptyStateButton}
                icon="plus"
              >
                Ajouter la première commune
              </Button>
            )}
          </View>
        ) : (
          filteredCommunes.map((commune) => (
            <CommuneCard key={commune.id} commune={commune} />
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
  communesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  communeCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  communeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  communeInfo: {
    flex: 1,
  },
  communeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  communeCode: {
    fontSize: 14,
  },
  communeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailChip: {
    marginBottom: 4,
  },
  communeFooter: {
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

export default CommunesScreen;