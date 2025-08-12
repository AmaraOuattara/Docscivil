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
import { etatService } from '../../services/api';

const EtatsScreen = ({ navigation }) => {
  const [etats, setEtats] = useState([]);
  const [filteredEtats, setFilteredEtats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEtat, setSelectedEtat] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    loadEtats();
  }, []);

  useEffect(() => {
    filterEtats();
  }, [searchQuery, etats]);

  const loadEtats = async () => {
    try {
      setLoading(true);
      const response = await etatService.getAll();
      setEtats(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des états:', error);
      Alert.alert('Erreur', 'Impossible de charger les états');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEtats();
    setRefreshing(false);
  };

  const filterEtats = () => {
    if (!searchQuery.trim()) {
      setFilteredEtats(etats);
      return;
    }

    const filtered = etats.filter(etat =>
      etat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      etat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEtats(filtered);
  };

  const handleEtatAction = (action, etat) => {
    setSelectedEtat(etat);
    setMenuVisible(false);
    
    switch (action) {
      case 'view':
        // Navigation vers la vue détaillée
        break;
      case 'edit':
        // Navigation vers l'édition
        break;
      case 'delete':
        confirmDeleteEtat(etat);
        break;
    }
  };

  const confirmDeleteEtat = (etat) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer l'état "${etat.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteEtat(etat.id),
        },
      ]
    );
  };

  const deleteEtat = async (id) => {
    try {
      await etatService.delete(id);
      await loadEtats();
      Alert.alert('Succès', 'État supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer l\'état');
    }
  };

  const EtatCard = ({ etat }) => (
    <Card style={[styles.etatCard, { backgroundColor: themeColors.surface }]}>
      <Card.Content>
        <View style={styles.etatHeader}>
          <View style={styles.etatInfo}>
            <Title style={[styles.etatName, { color: themeColors.text }]}>
              {etat.name}
            </Title>
            {etat.description && (
              <Paragraph style={[styles.etatDescription, { color: themeColors.textSecondary }]}>
                {etat.description}
              </Paragraph>
            )}
          </View>
          <Menu
            visible={menuVisible && selectedEtat?.id === etat.id}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuAnchor}
          >
            <Menu.Item
              onPress={() => handleEtatAction('view', etat)}
              title="Voir les détails"
              leadingIcon="eye"
            />
            <Menu.Item
              onPress={() => handleEtatAction('edit', etat)}
              title="Modifier"
              leadingIcon="pencil"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleEtatAction('delete', etat)}
              title="Supprimer"
              leadingIcon="delete"
              titleStyle={{ color: themeColors.error }}
            />
          </Menu>
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={(event) => {
              setSelectedEtat(etat);
              setMenuAnchor(event.target);
              setMenuVisible(true);
            }}
          />
        </View>
        
        <View style={styles.etatDetails}>
          {etat.type && (
            <Chip
              icon="flag"
              style={[styles.detailChip, { backgroundColor: themeColors.primaryLight }]}
              textStyle={{ color: themeColors.primary }}
            >
              {etat.type}
            </Chip>
          )}
          {etat.region && (
            <Chip
              icon="map"
              style={[styles.detailChip, { backgroundColor: themeColors.accent }]}
              textStyle={{ color: 'white' }}
            >
              {etat.region}
            </Chip>
          )}
        </View>

        <View style={styles.etatFooter}>
          <Text style={[styles.createdAt, { color: themeColors.textSecondary }]}>
            Créé le {new Date(etat.createdAt).toLocaleDateString('fr-FR')}
          </Text>
          <View style={styles.statusContainer}>
            <Chip
              icon={etat.status === 'active' ? 'check-circle' : 'pause-circle'}
              style={[
                styles.statusChip,
                {
                  backgroundColor: etat.status === 'active' ? themeColors.success : themeColors.warning,
                },
              ]}
              textStyle={{ color: 'white' }}
            >
              {etat.status === 'active' ? 'Actif' : 'Inactif'}
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
          Chargement des états...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* En-tête avec recherche */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher un état..."
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
              {etats.length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Total
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.success }]}>
              {etats.filter(e => e.status === 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Actifs
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statValue, { color: themeColors.warning }]}>
              {etats.filter(e => e.status !== 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Inactifs
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Liste des états */}
      <ScrollView
        style={styles.etatsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredEtats.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
              {searchQuery ? 'Aucun état trouvé' : 'Aucun état pour le moment'}
            </Text>
            {!searchQuery && (
              <Button
                mode="outlined"
                onPress={() => {/* Navigation vers l'ajout */}}
                style={styles.emptyStateButton}
                icon="plus"
              >
                Ajouter le premier état
              </Button>
            )}
          </View>
        ) : (
          filteredEtats.map((etat) => (
            <EtatCard key={etat.id} etat={etat} />
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
  etatsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  etatCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  etatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  etatInfo: {
    flex: 1,
  },
  etatName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  etatDescription: {
    fontSize: 14,
  },
  etatDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailChip: {
    marginBottom: 4,
  },
  etatFooter: {
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

export default EtatsScreen;