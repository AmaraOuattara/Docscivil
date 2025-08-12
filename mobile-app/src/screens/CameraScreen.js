import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Dialog,
  Portal,
  TextInput,
  HelperText,
  Chip,
  FAB,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function CameraScreen({ navigation }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [imageMetadata, setImageMetadata] = useState({
    title: '',
    description: '',
    category: '',
    prospect: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Demander les permissions de caméra au montage du composant
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      // Ici, vous demanderiez la permission d'accès à la caméra
      // Pour l'exemple, on simule que la permission est accordée
      console.log('Permission caméra accordée');
    } catch (error) {
      console.error('Erreur lors de la demande de permission caméra:', error);
      Alert.alert(
        'Permission requise',
        'L\'accès à la caméra est nécessaire pour prendre des photos'
      );
    }
  };

  const startCamera = () => {
    setCameraActive(true);
    // Ici, vous activeriez la caméra
    console.log('Caméra activée');
  };

  const stopCamera = () => {
    setCameraActive(false);
    // Ici, vous désactiveriez la caméra
    console.log('Caméra désactivée');
  };

  const takePhoto = () => {
    if (!cameraActive) return;

    // Simulation de prise de photo
    const newImage = {
      id: Date.now(),
      uri: `photo_${Date.now()}.jpg`,
      timestamp: new Date().toISOString(),
      metadata: {
        title: 'Photo capturée',
        description: 'Document scanné',
        category: 'DOCUMENT',
        prospect: 'Nouveau prospect',
      },
    };

    setCapturedImages(prev => [newImage, ...prev]);
    setSelectedImage(newImage);
    setShowImageDialog(true);
    
    // Arrêter la caméra après la prise de photo
    stopCamera();
  };

  const saveImage = () => {
    if (!validateMetadata()) return;

    try {
      // Mettre à jour les métadonnées de l'image
      const updatedImages = capturedImages.map(img => 
        img.id === selectedImage.id 
          ? { ...img, metadata: imageMetadata }
          : img
      );
      
      setCapturedImages(updatedImages);
      setShowSaveDialog(false);
      setShowImageDialog(false);
      resetMetadata();
      
      Alert.alert('Succès', 'Image sauvegardée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'image');
    }
  };

  const deleteImage = (imageId) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette image ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setCapturedImages(prev => prev.filter(img => img.id !== imageId));
            if (selectedImage?.id === imageId) {
              setShowImageDialog(false);
              setSelectedImage(null);
            }
          }
        }
      ]
    );
  };

  const validateMetadata = () => {
    const newErrors = {};

    if (!imageMetadata.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!imageMetadata.category.trim()) {
      newErrors.category = 'La catégorie est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetMetadata = () => {
    setImageMetadata({
      title: '',
      description: '',
      category: '',
      prospect: '',
    });
    setErrors({});
  };

  const openSaveDialog = (image) => {
    setSelectedImage(image);
    setImageMetadata(image.metadata);
    setShowSaveDialog(true);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'DOCUMENT':
        return theme.colors.primary;
      case 'IDENTITE':
        return theme.colors.success;
      case 'CONTRAT':
        return theme.colors.warning;
      case 'AUTRE':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'DOCUMENT':
        return 'Document';
      case 'IDENTITE':
        return 'Pièce d\'identité';
      case 'CONTRAT':
        return 'Contrat';
      case 'AUTRE':
        return 'Autre';
      default:
        return category;
    }
  };

  const CameraView = () => (
    <View style={styles.cameraContainer}>
      <View style={styles.cameraPlaceholder}>
        <Ionicons name="camera" size={64} color={theme.colors.primary} />
        <Text style={styles.cameraText}>Caméra active</Text>
        <Text style={styles.cameraSubtext}>Prêt à prendre une photo</Text>
      </View>
      
      {/* Contrôles de la caméra */}
      <View style={styles.cameraControls}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={stopCamera}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePhoto}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => {}}
        >
          <Ionicons name="sync" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const ImageCard = ({ image }) => (
    <TouchableOpacity onPress={() => setSelectedImage(image)}>
      <Card style={styles.imageCard}>
        <Card.Content>
          <View style={styles.imageCardHeader}>
            <View style={styles.imageInfo}>
              <Title style={styles.imageTitle}>
                {image.metadata.title || 'Sans titre'}
              </Title>
              <Paragraph style={styles.imageDescription}>
                {image.metadata.description || 'Aucune description'}
              </Paragraph>
              <View style={styles.imageMeta}>
                <Chip
                  style={[styles.categoryChip, { backgroundColor: getCategoryColor(image.metadata.category) }]}
                  textStyle={styles.categoryChipText}
                >
                  {getCategoryText(image.metadata.category)}
                </Chip>
                <Text style={styles.imageDate}>
                  {new Date(image.timestamp).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.imageActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openSaveDialog(image)}
              >
                <Ionicons name="pencil" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => deleteImage(image.id)}
              >
                <Ionicons name="trash" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Appareil photo</Title>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {}}
        >
          <Ionicons name="help-circle" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Zone de caméra ou liste des images */}
      {cameraActive ? (
        <CameraView />
      ) : (
        <ScrollView style={styles.imagesList}>
          {capturedImages.length > 0 ? (
            capturedImages.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={80} color={theme.colors.textSecondary} />
              </View>
              <Title style={styles.emptyTitle}>Aucune photo</Title>
              <Paragraph style={styles.emptySubtitle}>
                Prenez votre première photo de document en appuyant sur le bouton ci-dessous
              </Paragraph>
            </View>
          )}
        </ScrollView>
      )}

      {/* FAB pour activer la caméra */}
      {!cameraActive && (
        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          icon="camera"
          onPress={startCamera}
          label="Prendre une photo"
        />
      )}

      {/* Dialog d'affichage d'image */}
      <Portal>
        <Dialog visible={showImageDialog} onDismiss={() => setShowImageDialog(false)}>
          <Dialog.Title>Photo capturée</Dialog.Title>
          <Dialog.Content>
            {selectedImage && (
              <View>
                <View style={styles.dialogImageContainer}>
                  <View style={styles.dialogImagePlaceholder}>
                    <Ionicons name="image" size={48} color={theme.colors.primary} />
                    <Text style={styles.dialogImageText}>Aperçu de l'image</Text>
                  </View>
                </View>
                
                <View style={styles.imageDetails}>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Titre:</Text> {selectedImage.metadata.title}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Catégorie:</Text> {getCategoryText(selectedImage.metadata.category)}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Date:</Text> {new Date(selectedImage.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowImageDialog(false)}>Fermer</Button>
            <Button onPress={() => openSaveDialog(selectedImage)} mode="contained">
              Modifier
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog de sauvegarde/modification */}
      <Portal>
        <Dialog visible={showSaveDialog} onDismiss={() => setShowSaveDialog(false)}>
          <Dialog.Title>Modifier l'image</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Titre *"
              value={imageMetadata.title}
              onChangeText={(text) => setImageMetadata(prev => ({ ...prev, title: text }))}
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
              label="Description"
              value={imageMetadata.description}
              onChangeText={(text) => setImageMetadata(prev => ({ ...prev, description: text }))}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />

            <TextInput
              label="Catégorie *"
              value={imageMetadata.category}
              onChangeText={(text) => setImageMetadata(prev => ({ ...prev, category: text }))}
              mode="outlined"
              style={styles.dialogInput}
              error={!!errors.category}
            />
            {errors.category && (
              <HelperText type="error" visible={!!errors.category}>
                {errors.category}
              </HelperText>
            )}

            <TextInput
              label="Prospect associé"
              value={imageMetadata.prospect}
              onChangeText={(text) => setImageMetadata(prev => ({ ...prev, prospect: text }))}
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSaveDialog(false)}>Annuler</Button>
            <Button onPress={saveImage} mode="contained">
              Sauvegarder
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  helpButton: {
    padding: theme.spacing.sm,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  cameraPlaceholder: {
    width: '100%',
    height: 400,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  cameraText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  cameraSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
  },
  imagesList: {
    flex: 1,
    padding: theme.spacing.md,
  },
  imageCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  imageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  imageInfo: {
    flex: 1,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  imageDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  imageMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryChip: {
    height: 24,
  },
  categoryChipText: {
    color: 'white',
    fontSize: 10,
  },
  imageDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  imageActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  cameraIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogImageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dialogImagePlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.divider,
    borderStyle: 'dashed',
  },
  dialogImageText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  imageDetails: {
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  detailLabel: {
    fontWeight: '600',
  },
  dialogInput: {
    marginBottom: theme.spacing.md,
  },
});