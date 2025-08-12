import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';
import ApiService from '../../services/apiService';

const ProspectsScreen = ({ navigation }) => {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProspects, setFilteredProspects] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadProspects();
    }, [])
  );

  useEffect(() => {
    filterProspects();
  }, [prospects, searchQuery]);

  const loadProspects = async (pageNum = 1, isRefresh = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }
      
      const response = await ApiService.getProspects(pageNum, 20, searchQuery);
      
      if (response.data) {
        const newProspects = response.data;
        
        if (pageNum === 1 || isRefresh) {
          setProspects(newProspects);
        } else {
          setProspects(prev => [...prev, ...newProspects]);
        }
        
        setHasMore(newProspects.length === 20);
        setPage(pageNum);
      }
    } catch (error) {
      console.log('Error loading prospects:', error);
      Alert.alert('Erreur', 'Impossible de charger les prospects');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterProspects = () => {
    if (!searchQuery.trim()) {
      setFilteredProspects(prospects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = prospects.filter(prospect =>
      prospect.clt_nom.toLowerCase().includes(query) ||
      prospect.clt_prenom.toLowerCase().includes(query) ||
      prospect.clt_contact.includes(query) ||
      prospect.clt_reference.toLowerCase().includes(query)
    );
    
    setFilteredProspects(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadProspects(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore && !searchQuery.trim()) {
      loadProspects(page + 1);
    }
  };

  const handleDeleteProspect = (prospect) => {
    Alert.alert(
      'Supprimer le prospect',
      `Êtes-vous sûr de vouloir supprimer ${prospect.clt_nom} ${prospect.clt_prenom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteProspect(prospect.Id_clt),
        },
      ]
    );
  };

  const deleteProspect = async (prospectId) => {
    try {
      await ApiService.deleteProspect(prospectId);
      setProspects(prev => prev.filter(p => p.Id_clt !== prospectId));
      Alert.alert('Succès', 'Prospect supprimé avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer le prospect');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIF':
        return COLORS.success;
      case 'INACTIF':
        return COLORS.warning;
      case 'SUSPENDU':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const ProspectCard = ({ prospect }) => (
    <TouchableOpacity
      style={styles.prospectCard}
      onPress={() => navigation.navigate('ProspectForm', { prospect })}
    >
      <View style={styles.prospectHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {prospect.clt_nom.charAt(0)}{prospect.clt_prenom.charAt(0)}
          </Text>
        </View>
        <View style={styles.prospectInfo}>
          <Text style={styles.prospectName}>
            {prospect.clt_nom} {prospect.clt_prenom}
          </Text>
          <Text style={styles.prospectReference}>
            Réf: {prospect.clt_reference}
          </Text>
          <Text style={styles.prospectContact}>
            <Ionicons name="call-outline" size={14} color={COLORS.textSecondary} />
            {' '}{prospect.clt_contact}
          </Text>
        </View>
        <View style={styles.prospectActions}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(prospect.Statut_client) + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(prospect.Statut_client) }
            ]}>
              {prospect.Statut_client}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProspect(prospect)}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.prospectDetails}>
        <Text style={styles.prospectCivilite}>
          <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
          {' '}{prospect.clt_civilite}
        </Text>
        <Text style={styles.prospectDate}>
          Ajouté le {new Date(prospect.date_creation).toLocaleDateString('fr-FR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyStateTitle}>Aucun prospect trouvé</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery.trim() 
          ? 'Aucun prospect ne correspond à votre recherche'
          : 'Commencez par ajouter votre premier prospect'
        }
      </Text>
      {!searchQuery.trim() && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProspectForm')}
        >
          <Text style={styles.addButtonText}>Ajouter un prospect</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!loading || page === 1) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un prospect..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProspectForm')}
        >
          <Ionicons name="add" size={24} color={COLORS.surface} />
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{filteredProspects.length}</Text>
          <Text style={styles.statLabel}>Prospects</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {filteredProspects.filter(p => p.Statut_client === 'ACTIF').length}
          </Text>
          <Text style={styles.statLabel}>Actifs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {filteredProspects.filter(p => 
              new Date(p.date_creation) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length}
          </Text>
          <Text style={styles.statLabel}>Cette semaine</Text>
        </View>
      </View>

      {/* Prospects List */}
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement des prospects...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProspects}
          keyExtractor={(item) => item.Id_clt.toString()}
          renderItem={({ item }) => <ProspectCard prospect={item} />}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={EmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 25,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  listContainer: {
    padding: SPACING.lg,
  },
  prospectCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  prospectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.primary,
  },
  prospectInfo: {
    flex: 1,
  },
  prospectName: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  prospectReference: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  prospectContact: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
  },
  prospectActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  prospectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  prospectCivilite: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
  },
  prospectDate: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
  },
  footer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
});

export default ProspectsScreen;