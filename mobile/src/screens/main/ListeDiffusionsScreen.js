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
import { listeDiffusionService } from '../../services/api';

const ListeDiffusionsScreen = ({ navigation }) => {
  const [listeDiffusions, setListeDiffusions] = useState([]);
  const [filteredListeDiffusions, setFilteredListeDiffusions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListeDiffusion, setSelectedListeDiffusion] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    loadListeDiffusions();
  }, []);

  useEffect(() => {
    filterListeDiffusions();
  }, [searchQuery, listeDiffusions]);

  const loadListeDiffusions = async () => {
    try {
      setLoading(true);
      const response = await listeDiffusionService.getAll();
      setListeDiffusions(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des listes de diffusion:', error);
      Alert.alert('Erreur', 'Impossible de charger les listes de diffusion');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadListeDiffusions();
    setRefreshing(false);
  };

  const filterListeDiffusions = () => {
    if (!searchQuery.trim()) {
      setFilteredListeDiffusions(listeDiffusions);
      return;
    }

    const filtered = listeDiffusions.filter(listeDiffusion =>
      listeDiffusion.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listeDiffusion.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredListeDiffusions(filtered);
  };

  const handleListeDiffusionAction = (action, listeDiffusion) => {
    setSelectedListeDiffusion(listeDiffusion);
    setMenuVisible(false);
    
    switch (action) {
      case 'view':
        // Navigation vers la vue détaillée
        break;
      case 'edit':
        // Navigation vers l'édition
        break;
      case 'delete':
        confirmDeleteListeDiffusion(listeDiffusion);
        break;
    }
  };

  const confirmDeleteListeDiffusion = (listeDiffusion) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer la liste de diffusion "${listeDiffusion.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteListeDiffusion(listeDiffusion.id),
        },
      ]
    );
  };

  const deleteListeDiffusion = async (id) => {
    try {
      await listeDiffusionService.delete(id);
      await loadListeDiffusions();
      Alert.alert('Succès', 'Liste de diffusion supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer la liste de diffusion');
    }
  };

  const ListeDiffusionCard = ({ listeDiffusion }) => (
    <Card style={[styles.listeDiffusionCard, { backgroundColor: themeColors.surface }]}>
      <Card.Content>
        <View style={styles.listeDiffusionHeader}>
          <View style={styles.listeDiffusionInfo}>
            <Title style={[styles.listeDiffusionName, { color: themeColors.text }]}>
              {listeDiffusion.name}
            </Title>
            {listeDiffusion.description && (
              <Paragraph style={[styles.listeDiffusionDescription, { color: themeColors.textSecondary }]}>
                {listeDiffusion.description}
              </Paragraph>
            )}
          </View>
          <Menu
            visible={menuVisible && selectedListeDiffusion?.id === listeDiffusion.id}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuAnchor}
          >
            <Menu.Item
              onPress={() => handleListeDiffusionAction('view', listeDiffusion)}
              title="Voir les détails"
              leadingIcon="eye"
            />
            <Menu.Item
              onPress={() => handleListeDiffusionAction('edit', listeDiffusion)}
              title="Modifier"
              leadingIcon="pencil"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleListeDiffusionAction('delete', listeDiffusion)}
              title="Supprimer"
              leadingIcon="delete"
              titleStyle={{ color: themeColors.error }}
            />
          </Menu>
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={(event) => {
              setSelectedListeDiffusion(listeDiffusion);
              setMenuAnchor(event.target);
              setMenuVisible(true);
            }}
          />
        </View>
        
        <View style={styles.listeDiffusionDetails}>
          {listeDiffusion.type && (
            <Chip
              icon="list"
              style={[styles.detailChip, { backgroundColor: themeColors.primaryLight }]}
              textStyle={{ color: themeColors.primary }}
            >
              {listeDiffusion.type}
            </Chip>
          )}
          {listeDiffusion.recipientCount && (
            <Chip
              icon="people"
              style={[styles.detailChip, { backgroundColor: themeColors.accent }]}
              textStyle={{ color: 'white' }}
            >
              {listeDiffusion.recipientCount} destinataires
            </Chip>
          )}
        </View>

        <View style={styles.listeDiffusionFooter}>
          <Text style={[styles.createdAt, { color: themeColors.textSecondary }]}>
            Créé le {new Date(listeDiffusion.createdAt).toLocaleDateString('fr-FR')}
          </Text>
          <View style={styles.statusContainer}>
            <Chip
              icon={listeDiffusion.status === 'active' ? 'check-circle' : 'pause-circle'}
              style={[
                styles.statusChip,
                {
                  backgroundColor: listeDiffusion.status === 'active' ? themeColors.success : themeColors.warning,
                },
              ]}
              textStyle={{ color: 'white' }}
            >
              {listeDiffusion.status === 'active' ? 'Active' : 'Inactive'}
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
          Chargement des listes de diffusion...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* En-tête avec recherche */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher une liste de diffusion..."
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
              {listeDiffusions.length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Total
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.success }]}>
              {listeDiffusions.filter(l => l.status === 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Actives
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.warning }]}>
              {listeDiffusions.filter(l => l.status !== 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Inactives
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Liste des listes de diffusion */}
      <ScrollView
        style={styles.listeDiffusionsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredListeDiffusions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
              {searchQuery ? 'Aucune liste de diffusion trouvée' : 'Aucune liste de diffusion pour le moment'}
            </Text>
            {!searchQuery && (
              <Button
                mode="outlined"
                onPress={() => {/* Navigation vers l'ajout */}}
                style={styles.emptyStateButton}
                icon="plus"
              >
                Ajouter la première liste de diffusion
              </Button>
            )}
          </View>
        ) : (
          filteredListeDiffusions.map((listeDiffusion) => (
            <ListeDiffusionCard key={listeDiffusion.id} listeDiffusion={listeDiffusion} />
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
  listeDiffusionsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listeDiffusionCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  listeDiffusionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listeDiffusionInfo: {
    flex: 1,
  },
  listeDiffusionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listeDiffusionDescription: {
    fontSize: 14,
  },
  listeDiffusionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailChip: {
    marginBottom: 4,
  },
  listeDiffusionFooter: {
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

export default ListeDiffusionsScreen;