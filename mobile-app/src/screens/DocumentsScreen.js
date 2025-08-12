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
  List,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function DocumentsScreen({ navigation }) {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    reference: '',
    status: 'EN_COURS',
  });
  const [errors, setErrors] = useState({});

  const documentCategories = [
    { label: 'Tous', value: 'ALL' },
    { label: 'Actes de naissance', value: 'ACTE_NAISSANCE' },
    { label: 'Actes de mariage', value: 'ACTE_MARIAGE' },
    { label: 'Actes de décès', value: 'ACTE_DECES' },
    { label: 'Certificats', value: 'CERTIFICAT' },
    { label: 'Autres', value: 'AUTRE' },
  ];

  const documentStatuses = [
    { label: 'En cours', value: 'EN_COURS' },
    { label: 'En attente', value: 'EN_ATTENTE' },
    { label: 'Terminé', value: 'TERMINE' },
    { label: 'Rejeté', value: 'REJETE' },
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [searchQuery, selectedCategory, documents]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // Simulation de données pour l'exemple
      const mockDocuments = [
        {
          id: 1,
          title: 'Acte de naissance - Jean Dupont',
          description: 'Demande d\'acte de naissance pour Jean Dupont',
          category: 'ACTE_NAISSANCE',
          reference: 'DOC-001',
          status: 'EN_COURS',
          dateCreation: '2024-01-15',
          prospect: 'Jean Dupont',
        },
        {
          id: 2,
          title: 'Acte de mariage - Marie Martin',
          description: 'Demande d\'acte de mariage pour Marie Martin',
          category: 'ACTE_MARIAGE',
          reference: 'DOC-002',
          status: 'TERMINE',
          dateCreation: '2024-01-10',
          prospect: 'Marie Martin',
        },
        {
          id: 3,
          title: 'Certificat de résidence - Pierre Durand',
          description: 'Demande de certificat de résidence',
          category: 'CERTIFICAT',
          reference: 'DOC-003',
          status: 'EN_ATTENTE',
          dateCreation: '2024-01-12',
          prospect: 'Pierre Durand',
        },
      ];
      
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
      Alert.alert('Erreur', 'Impossible de charger les documents');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  };

  const filterDocuments = () => {
    let filtered = documents;

    // Filtre par catégorie
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.title?.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query) ||
        d.reference?.toLowerCase().includes(query) ||
        d.prospect?.toLowerCase().includes(query)
      );
    }

    setFilteredDocuments(filtered);
  };

  const handleAddDocument = async () => {
    if (!validateForm()) return;

    try {
      // Simulation d'ajout
      const newDocument = {
        id: Date.now(),
        ...formData,
        dateCreation: new Date().toISOString().split('T')[0],
        prospect: 'Nouveau prospect',
      };
      
      setDocuments(prev => [newDocument, ...prev]);
      setShowAddDialog(false);
      resetForm();
      Alert.alert('Succès', 'Document ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le document');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'La catégorie est requise';
    }
    if (!formData.reference.trim()) {
      newErrors.reference = 'La référence est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      reference: '',
      status: 'EN_COURS',
    });
    setErrors({});
  };

  const openViewDialog = (document) => {
    setSelectedDocument(document);
    setShowViewDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_COURS':
        return theme.colors.warning;
      case 'TERMINE':
        return theme.colors.success;
      case 'EN_ATTENTE':
        return theme.colors.info;
      case 'REJETE':
        return theme.colors.error;
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
      case 'REJETE':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getCategoryText = (category) => {
    const cat = documentCategories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const DocumentCard = ({ document }) => (
    <TouchableOpacity onPress={() => openViewDialog(document)}>
      <Card style={styles.documentCard}>
        <Card.Content>
          <View style={styles.documentHeader}>
            <View style={styles.documentInfo}>
              <Title style={styles.documentTitle}>{document.title}</Title>
              <Paragraph style={styles.documentDescription}>
                {document.description}
              </Paragraph>
              <View style={styles.documentMeta}>
                <Text style={styles.documentReference}>
                  Ref: {document.reference}
                </Text>
                <Text style={styles.documentDate}>
                  {new Date(document.dateCreation).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.documentActions}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(document.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(document.status)}
                </Text>
              </View>
              <Chip style={styles.categoryChip} textStyle={styles.categoryChipText}>
                {getCategoryText(document.category)}
              </Chip>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header avec recherche et filtres */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher un document..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {documentCategories.map((category) => (
            <Chip
              key={category.value}
              selected={selectedCategory === category.value}
              onPress={() => setSelectedCategory(category.value)}
              style={styles.filterChip}
              selectedColor={theme.colors.primary}
            >
              {category.label}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Liste des documents */}
      <ScrollView
        style={styles.documentsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'ALL'
                ? 'Aucun document trouvé avec ces critères'
                : 'Aucun document pour le moment'}
            </Text>
            {!searchQuery && selectedCategory === 'ALL' && (
              <Button
                mode="contained"
                onPress={() => setShowAddDialog(true)}
                style={styles.emptyButton}
              >
                Ajouter le premier document
              </Button>
            )}
          </View>
        )}
      </ScrollView>

      {/* FAB pour ajouter un document */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => setShowAddDialog(true)}
        label="Nouveau document"
      />

      {/* Dialog d'ajout */}
      <Portal>
        <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
          <Dialog.Title>Ajouter un document</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Titre *"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              mode="outlined"
              style={styles.dialogInput}
              error={!!errors.title}
            />
            {errors.title && (
              <HelperText type="error" visible={!!errors.title}>
                {errors.title}
              </HelperText>
            )}

            <TextInput
              label="Description *"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
              error={!!errors.description}
            />
            {errors.description && (
              <HelperText type="error" visible={!!errors.description}>
                {errors.description}
              </HelperText>
            )}

            <TextInput
              label="Référence *"
              value={formData.reference}
              onChangeText={(text) => setFormData(prev => ({ ...prev, reference: text }))}
              mode="outlined"
              style={styles.dialogInput}
              error={!!errors.reference}
            />
            {errors.reference && (
              <HelperText type="error" visible={!!errors.reference}>
                {errors.reference}
              </HelperText>
            )}

            <TextInput
              label="Catégorie *"
              value={formData.category}
              onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
              mode="outlined"
              style={styles.dialogInput}
              error={!!errors.category}
            />
            {errors.category && (
              <HelperText type="error" visible={!!errors.category}>
                {errors.category}
              </HelperText>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddDialog(false)}>Annuler</Button>
            <Button onPress={handleAddDocument} mode="contained">
              Ajouter
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog de visualisation */}
      <Portal>
        <Dialog visible={showViewDialog} onDismiss={() => setShowViewDialog(false)}>
          <Dialog.Title>Détails du document</Dialog.Title>
          <Dialog.Content>
            {selectedDocument && (
              <View>
                <List.Item
                  title="Titre"
                  description={selectedDocument.title}
                  left={(props) => <List.Icon {...props} icon="file-document" />}
                />
                <List.Item
                  title="Description"
                  description={selectedDocument.description}
                  left={(props) => <List.Icon {...props} icon="text" />}
                />
                <List.Item
                  title="Référence"
                  description={selectedDocument.reference}
                  left={(props) => <List.Icon {...props} icon="tag" />}
                />
                <List.Item
                  title="Catégorie"
                  description={getCategoryText(selectedDocument.category)}
                  left={(props) => <List.Icon {...props} icon="folder" />}
                />
                <List.Item
                  title="Statut"
                  description={getStatusText(selectedDocument.status)}
                  left={(props) => <List.Icon {...props} icon="information" />}
                />
                <List.Item
                  title="Prospect"
                  description={selectedDocument.prospect}
                  left={(props) => <List.Icon {...props} icon="account" />}
                />
                <List.Item
                  title="Date de création"
                  description={new Date(selectedDocument.dateCreation).toLocaleDateString()}
                  left={(props) => <List.Icon {...props} icon="calendar" />}
                />
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowViewDialog(false)}>Fermer</Button>
            <Button mode="contained" onPress={() => {
              setShowViewDialog(false);
              // Navigation vers l'édition
            }}>
              Modifier
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
  documentsList: {
    flex: 1,
    padding: theme.spacing.md,
  },
  documentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  documentDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  documentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentReference: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  documentDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  documentActions: {
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
  categoryChip: {
    backgroundColor: theme.colors.primaryLight,
  },
  categoryChipText: {
    color: 'white',
    fontSize: 10,
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