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
import { typeCopieService } from '../../services/api';

const TypeCopiesScreen = ({ navigation }) => {
  const [typeCopies, setTypeCopies] = useState([]);
  const [filteredTypeCopies, setFilteredTypeCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeCopie, setSelectedTypeCopie] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    loadTypeCopies();
  }, []);

  useEffect(() => {
    filterTypeCopies();
  }, [searchQuery, typeCopies]);

  const loadTypeCopies = async () => {
    try {
      setLoading(true);
      const response = await typeCopieService.getAll();
      setTypeCopies(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des types de copies:', error);
      Alert.alert('Erreur', 'Impossible de charger les types de copies');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTypeCopies();
    setRefreshing(false);
  };

  const filterTypeCopies = () => {
    if (!searchQuery.trim()) {
      setFilteredTypeCopies(typeCopies);
      return;
    }

    const filtered = typeCopies.filter(typeCopie =>
      typeCopie.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      typeCopie.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTypeCopies(filtered);
  };

  const handleTypeCopieAction = (action, typeCopie) => {
    setSelectedTypeCopie(typeCopie);
    setMenuVisible(false);
    
    switch (action) {
      case 'view':
        // Navigation vers la vue détaillée
        break;
      case 'edit':
        // Navigation vers l'édition
        break;
      case 'delete':
        confirmDeleteTypeCopie(typeCopie);
        break;
    }
  };

  const confirmDeleteTypeCopie = (typeCopie) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer le type de copie "${typeCopie.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteTypeCopie(typeCopie.id),
        },
      ]
    );
  };

  const deleteTypeCopie = async (id) => {
    try {
      await typeCopieService.delete(id);
      await loadTypeCopies();
      Alert.alert('Succès', 'Type de copie supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le type de copie');
    }
  };

  const TypeCopieCard = ({ typeCopie }) => (
    <Card style={[styles.typeCopieCard, { backgroundColor: themeColors.surface }]}>
      <Card.Content>
        <View style={styles.typeCopieHeader}>
          <View style={styles.typeCopieInfo}>
            <Title style={[styles.typeCopieName, { color: themeColors.text }]}>
              {typeCopie.name}
            </Title>
            {typeCopie.description && (
              <Paragraph style={[styles.typeCopieDescription, { color: themeColors.textSecondary }]}>
                {typeCopie.description}
              </Paragraph>
            )}
          </View>
          <Menu
            visible={menuVisible && selectedTypeCopie?.id === typeCopie.id}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuAnchor}
          >
            <Menu.Item
              onPress={() => handleTypeCopieAction('view', typeCopie)}
              title="Voir les détails"
              leadingIcon="eye"
            />
            <Menu.Item
              onPress={() => handleTypeCopieAction('edit', typeCopie)}
              title="Modifier"
              leadingIcon="pencil"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleTypeCopieAction('delete', typeCopie)}
              title="Supprimer"
              leadingIcon="delete"
              titleStyle={{ color: themeColors.error }}
            />
          </Menu>
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={(event) => {
              setSelectedTypeCopie(typeCopie);
              setMenuAnchor(event.target);
              setMenuVisible(true);
            }}
          />
        </View>
        
        <View style={styles.typeCopieDetails}>
          {typeCopie.category && (
            <Chip
              icon="category"
              style={[styles.detailChip, { backgroundColor: themeColors.primaryLight }]}
              textStyle={{ color: themeColors.primary }}
            >
              {typeCopie.category}
            </Chip>
          )}
          {typeCopie.required && (
            <Chip
              icon="star"
              style={[styles.detailChip, { backgroundColor: themeColors.accent }]}
              textStyle={{ color: 'white' }}
            >
              Requis
            </Chip>
          )}
        </View>

        <View style={styles.typeCopieFooter}>
          <Text style={[styles.createdAt, { color: themeColors.textSecondary }]}>
            Créé le {new Date(typeCopie.createdAt).toLocaleDateString('fr-FR')}
          </Text>
          <View style={styles.statusContainer}>
            <Chip
              icon={typeCopie.status === 'active' ? 'check-circle' : 'pause-circle'}
              style={[
                styles.statusChip,
                {
                  backgroundColor: typeCopie.status === 'active' ? themeColors.success : themeColors.warning,
                },
              ]}
              textStyle={{ color: 'white' }}
            >
              {typeCopie.status === 'active' ? 'Actif' : 'Inactif'}
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
          Chargement des types de copies...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* En-tête avec recherche */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher un type de copie..."
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
              {typeCopies.length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Total
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.success }]}>
              {typeCopies.filter(t => t.status === 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Actifs
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.warning }]}>
              {typeCopies.filter(t => t.status !== 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Inactifs
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Liste des types de copies */}
      <ScrollView
        style={styles.typeCopiesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTypeCopies.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
              {searchQuery ? 'Aucun type de copie trouvé' : 'Aucun type de copie pour le moment'}
            </Text>
            {!searchQuery && (
              <Button
                mode="outlined"
                onPress={() => {/* Navigation vers l'ajout */}}
                style={styles.emptyStateButton}
                icon="plus"
              >
                Ajouter le premier type de copie
              </Button>
            )}
          </View>
        ) : (
          filteredTypeCopies.map((typeCopie) => (
            <TypeCopieCard key={typeCopie.id} typeCopie={typeCopie} />
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
  typeCopiesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  typeCopieCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  typeCopieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeCopieInfo: {
    flex: 1,
  },
  typeCopieName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  typeCopieDescription: {
    fontSize: 14,
  },
  typeCopieDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailChip: {
    marginBottom: 4,
  },
  typeCopieFooter: {
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

export default TypeCopiesScreen;