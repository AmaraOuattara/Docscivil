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
import { juridictionService } from '../../services/api';

const JuridictionsScreen = ({ navigation }) => {
  const [juridictions, setJuridictions] = useState([]);
  const [filteredJuridictions, setFilteredJuridictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJuridiction, setSelectedJuridiction] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    loadJuridictions();
  }, []);

  useEffect(() => {
    filterJuridictions();
  }, [searchQuery, juridictions]);

  const loadJuridictions = async () => {
    try {
      setLoading(true);
      const response = await juridictionService.getAll();
      setJuridictions(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des juridictions:', error);
      Alert.alert('Erreur', 'Impossible de charger les juridictions');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJuridictions();
    setRefreshing(false);
  };

  const filterJuridictions = () => {
    if (!searchQuery.trim()) {
      setFilteredJuridictions(juridictions);
      return;
    }

    const filtered = juridictions.filter(juridiction =>
      juridiction.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      juridiction.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJuridictions(filtered);
  };

  const handleJuridictionAction = (action, juridiction) => {
    setSelectedJuridiction(juridiction);
    setMenuVisible(false);
    
    switch (action) {
      case 'view':
        // Navigation vers la vue détaillée
        break;
      case 'edit':
        // Navigation vers l'édition
        break;
      case 'delete':
        confirmDeleteJuridiction(juridiction);
        break;
    }
  };

  const confirmDeleteJuridiction = (juridiction) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer la juridiction "${juridiction.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteJuridiction(juridiction.id),
        },
      ]
    );
  };

  const deleteJuridiction = async (id) => {
    try {
      await juridictionService.delete(id);
      await loadJuridictions();
      Alert.alert('Succès', 'Juridiction supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer la juridiction');
    }
  };

  const JuridictionCard = ({ juridiction }) => (
    <Card style={[styles.juridictionCard, { backgroundColor: themeColors.surface }]}>
      <Card.Content>
        <View style={styles.juridictionHeader}>
          <View style={styles.juridictionInfo}>
            <Title style={[styles.juridictionName, { color: themeColors.text }]}>
              {juridiction.name}
            </Title>
            {juridiction.description && (
              <Paragraph style={[styles.juridictionDescription, { color: themeColors.textSecondary }]}>
                {juridiction.description}
              </Paragraph>
            )}
          </View>
          <Menu
            visible={menuVisible && selectedJuridiction?.id === juridiction.id}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuAnchor}
          >
            <Menu.Item
              onPress={() => handleJuridictionAction('view', juridiction)}
              title="Voir les détails"
              leadingIcon="eye"
            />
            <Menu.Item
              onPress={() => handleJuridictionAction('edit', juridiction)}
              title="Modifier"
              leadingIcon="pencil"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleJuridictionAction('delete', juridiction)}
              title="Supprimer"
              leadingIcon="delete"
              titleStyle={{ color: themeColors.error }}
            />
          </Menu>
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={(event) => {
              setSelectedJuridiction(juridiction);
              setMenuAnchor(event.target);
              setMenuVisible(true);
            }}
          />
        </View>
        
        <View style={styles.juridictionDetails}>
          {juridiction.type && (
            <Chip
              icon="gavel"
              style={[styles.detailChip, { backgroundColor: themeColors.primaryLight }]}
              textStyle={{ color: themeColors.primary }}
            >
              {juridiction.type}
            </Chip>
          )}
          {juridiction.region && (
            <Chip
              icon="map"
              style={[styles.detailChip, { backgroundColor: themeColors.accent }]}
              textStyle={{ color: 'white' }}
            >
              {juridiction.region}
            </Chip>
          )}
        </View>

        <View style={styles.juridictionFooter}>
          <Text style={[styles.createdAt, { color: themeColors.textSecondary }]}>
            Créé le {new Date(juridiction.createdAt).toLocaleDateString('fr-FR')}
          </Text>
          <View style={styles.statusContainer}>
            <Chip
              icon={juridiction.status === 'active' ? 'check-circle' : 'pause-circle'}
              style={[
                styles.statusChip,
                {
                  backgroundColor: juridiction.status === 'active' ? themeColors.success : themeColors.warning,
                },
              ]}
              textStyle={{ color: 'white' }}
            >
              {juridiction.status === 'active' ? 'Active' : 'Inactive'}
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
          Chargement des juridictions...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* En-tête avec recherche */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher une juridiction..."
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
              {juridictions.length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Total
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.success }]}>
              {juridictions.filter(j => j.status === 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Actives
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.warning }]}>
              {juridictions.filter(j => j.status !== 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Inactives
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Liste des juridictions */}
      <ScrollView
        style={styles.juridictionsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredJuridictions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
              {searchQuery ? 'Aucune juridiction trouvée' : 'Aucune juridiction pour le moment'}
            </Text>
            {!searchQuery && (
              <Button
                mode="outlined"
                onPress={() => {/* Navigation vers l'ajout */}}
                style={styles.emptyStateButton}
                icon="plus"
              >
                Ajouter la première juridiction
              </Button>
            )}
          </View>
        ) : (
          filteredJuridictions.map((juridiction) => (
            <JuridictionCard key={juridiction.id} juridiction={juridiction} />
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
  juridictionsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  juridictionCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  juridictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  juridictionInfo: {
    flex: 1,
  },
  juridictionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  juridictionDescription: {
    fontSize: 14,
  },
  juridictionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailChip: {
    marginBottom: 4,
  },
  juridictionFooter: {
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

export default JuridictionsScreen;