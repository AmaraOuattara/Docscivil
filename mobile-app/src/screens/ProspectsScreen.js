import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Searchbar,
  Chip,
  Dialog,
  Portal,
  TextInput,
  HelperText,
  Menu,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { prospectService } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function ProspectsScreen({ navigation }) {
  const [prospects, setProspects] = useState([]);
  const [filteredProspects, setFilteredProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [formData, setFormData] = useState({
    clt_reference: '',
    clt_nom: '',
    clt_prenom: '',
    clt_civilite: 'M',
    clt_contact: '',
    lst_reference: '',
    Statut_client: 'EN_ATTENTE',
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  const statusOptions = [
    { label: 'Tous', value: 'ALL' },
    { label: 'En attente', value: 'EN_ATTENTE' },
    { label: 'En cours', value: 'EN_COURS' },
    { label: 'Terminé', value: 'TERMINE' },
  ];

  const civiliteOptions = [
    { label: 'Monsieur', value: 'M' },
    { label: 'Madame', value: 'F' },
    { label: 'Mademoiselle', value: 'MLLE' },
  ];

  useEffect(() => {
    loadProspects();
  }, [currentPage]);

  useEffect(() => {
    filterProspects();
  }, [searchQuery, selectedStatus, prospects]);

  const loadProspects = async () => {
    setLoading(true);
    try {
      const response = await prospectService.getAll({
        page: currentPage,
        size: itemsPerPage,
      });
      
      if (response.data.code === '200') {
        if (currentPage === 1) {
          setProspects(response.data.content);
        } else {
          setProspects(prev => [...prev, ...response.data.content]);
        }
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des prospects:', error);
      Alert.alert('Erreur', 'Impossible de charger les prospects');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadProspects();
    setRefreshing(false);
  };

  const filterProspects = () => {
    let filtered = prospects;

    // Filtre par statut
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(p => p.Statut_client === selectedStatus);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.clt_nom?.toLowerCase().includes(query) ||
        p.clt_prenom?.toLowerCase().includes(query) ||
        p.clt_contact?.includes(query) ||
        p.clt_reference?.toLowerCase().includes(query)
      );
    }

    setFilteredProspects(filtered);
  };

  const handleAddProspect = async () => {
    if (!validateForm()) return;

    try {
      const response = await prospectService.create(formData);
      if (response.data.code === '201') {
        Alert.alert('Succès', 'Prospect ajouté avec succès');
        setShowAddDialog(false);
        resetForm();
        setCurrentPage(1);
        await loadProspects();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le prospect');
    }
  };

  const handleEditProspect = async () => {
    if (!validateForm()) return;

    try {
      const response = await prospectService.update(selectedProspect.id, formData);
      if (response.status === 200) {
        Alert.alert('Succès', 'Prospect modifié avec succès');
        setShowEditDialog(false);
        resetForm();
        await loadProspects();
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      Alert.alert('Erreur', 'Impossible de modifier le prospect');
    }
  };

  const handleDeleteProspect = async () => {
    try {
      await prospectService.delete(selectedProspect.id);
      Alert.alert('Succès', 'Prospect supprimé avec succès');
      setShowDeleteDialog(false);
      await loadProspects();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le prospect');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clt_reference.trim()) {
      newErrors.clt_reference = 'La référence est requise';
    }
    if (!formData.clt_nom.trim()) {
      newErrors.clt_nom = 'Le nom est requis';
    }
    if (!formData.clt_contact.trim()) {
      newErrors.clt_contact = 'Le contact est requis';
    }
    if (!formData.lst_reference.trim()) {
      newErrors.lst_reference = 'La liste de diffusion est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      clt_reference: '',
      clt_nom: '',
      clt_prenom: '',
      clt_civilite: 'M',
      clt_contact: '',
      lst_reference: '',
      Statut_client: 'EN_ATTENTE',
    });
    setErrors({});
  };

  const openEditDialog = (prospect) => {
    setSelectedProspect(prospect);
    setFormData({
      clt_reference: prospect.clt_reference || '',
      clt_nom: prospect.clt_nom || '',
      clt_prenom: prospect.clt_prenom || '',
      clt_civilite: prospect.clt_civilite || 'M',
      clt_contact: prospect.clt_contact || '',
      lst_reference: prospect.lst_reference || '',
      Statut_client: prospect.Statut_client || 'EN_ATTENTE',
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (prospect) => {
    setSelectedProspect(prospect);
    setShowDeleteDialog(true);
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

  const ProspectCard = ({ prospect }) => (
    <Card style={styles.prospectCard}>
      <Card.Content>
        <View style={styles.prospectHeader}>
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
          <View style={styles.prospectActions}>
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
            <Menu
              visible={false}
              anchor={
                <TouchableOpacity style={styles.menuButton}>
                  <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => openEditDialog(prospect)}
                title="Modifier"
                leadingIcon="pencil"
              />
              <Divider />
              <Menu.Item
                onPress={() => openDeleteDialog(prospect)}
                title="Supprimer"
                leadingIcon="delete"
                titleStyle={{ color: theme.colors.error }}
              />
            </Menu>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header avec recherche et filtres */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher un prospect..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {statusOptions.map((option) => (
            <Chip
              key={option.value}
              selected={selectedStatus === option.value}
              onPress={() => setSelectedStatus(option.value)}
              style={styles.filterChip}
              selectedColor={theme.colors.primary}
            >
              {option.label}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Liste des prospects */}
      <ScrollView
        style={styles.prospectsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredProspects.length > 0 ? (
          filteredProspects.map((prospect, index) => (
            <ProspectCard key={prospect.id || index} prospect={prospect} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>
              {searchQuery || selectedStatus !== 'ALL'
                ? 'Aucun prospect trouvé avec ces critères'
                : 'Aucun prospect pour le moment'}
            </Text>
            {!searchQuery && selectedStatus === 'ALL' && (
              <Button
                mode="contained"
                onPress={() => setShowAddDialog(true)}
                style={styles.emptyButton}
              >
                Ajouter le premier prospect
              </Button>
            )}
          </View>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.pagination}>
            <Button
              mode="outlined"
              onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <Text style={styles.pageInfo}>
              Page {currentPage} sur {totalPages}
            </Text>
            <Button
              mode="outlined"
              onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </View>
        )}
      </ScrollView>

      {/* FAB pour ajouter un prospect */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => setShowAddDialog(true)}
        label="Nouveau prospect"
      />

      {/* Dialog d'ajout */}
      <Portal>
        <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
          <Dialog.Title>Ajouter un prospect</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Référence *"
              value={formData.clt_reference}
              onChangeText={(text) => setFormData(prev => ({ ...prev, clt_reference: text }))}
              mode="outlined"
              style={styles.dialogInput}
              error={!!errors.clt_reference}
            />
            {errors.clt_reference && (
              <HelperText type="error" visible={!!errors.clt_reference}>
                {errors.clt_reference}
              </HelperText>
            )}

            <TextInput
              label="Nom *"
              value={formData.clt_nom}
              onChangeText={(text) => setFormData(prev => ({ ...prev, clt_nom: text }))}
              mode="outlined"
              style={styles.dialogInput}
              error={!!errors.clt_nom}
            />
            {errors.clt_nom && (
              <HelperText type="error" visible={!!errors.clt_nom}>
                {errors.clt_nom}
              </HelperText>
            )}

            <TextInput
              label="Prénom"
              value={formData.clt_prenom}
              onChangeText={(text) => setFormData(prev => ({ ...prev, clt_prenom: text }))}
              mode="outlined"
              style={styles.dialogInput}
            />

            <TextInput
              label="Contact *"
              value={formData.clt_contact}
              onChangeText={(text) => setFormData(prev => ({ ...prev, clt_contact: text }))}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.dialogInput}
              error={!!errors.clt_contact}
            />
            {errors.clt_contact && (
              <HelperText type="error" visible={!!errors.clt_contact}>
                {errors.clt_contact}
              </HelperText>
            )}

            <TextInput
              label="Liste de diffusion *"
              value={formData.lst_reference}
              onChangeText={(text) => setFormData(prev => ({ ...prev, lst_reference: text }))}
              mode="outlined"
              style={styles.dialogInput}
              error={!!errors.lst_reference}
            />
            {errors.lst_reference && (
              <HelperText type="error" visible={!!errors.lst_reference}>
                {errors.lst_reference}
              </HelperText>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddDialog(false)}>Annuler</Button>
            <Button onPress={handleAddProspect} mode="contained">
              Ajouter
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog de modification */}
      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>Modifier le prospect</Dialog.Title>
          <Dialog.Content>
            {/* Même contenu que le dialog d'ajout */}
            <TextInput
              label="Référence *"
              value={formData.clt_reference}
              onChangeText={(text) => setFormData(prev => ({ ...prev, clt_reference: text }))}
              mode="outlined"
              style={styles.dialogInput}
              error={!!errors.clt_reference}
            />
            {/* ... autres champs ... */}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>Annuler</Button>
            <Button onPress={handleEditProspect} mode="contained">
              Modifier
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog de suppression */}
      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Confirmer la suppression</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Êtes-vous sûr de vouloir supprimer le prospect "{selectedProspect?.clt_nom} {selectedProspect?.clt_prenom}" ?
              Cette action est irréversible.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Annuler</Button>
            <Button onPress={handleDeleteProspect} textColor={theme.colors.error}>
              Supprimer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  searchBar: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  filtersContainer: {
    marginBottom: theme.spacing.sm,
  },
  filterChip: {
    marginRight: theme.spacing.sm,
  },
  prospectsList: {
    flex: 1,
    padding: theme.spacing.md,
  },
  prospectCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  prospectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  prospectInfo: {
    flex: 1,
  },
  prospectName: {
    fontSize: 18,
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
  prospectActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing.sm,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  menuButton: {
    padding: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  pageInfo: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogInput: {
    marginBottom: theme.spacing.md,
  },
});