import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Linking,
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
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function ScanQRScreen({ navigation }) {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualCodeError, setManualCodeError] = useState('');

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
        'L\'accès à la caméra est nécessaire pour scanner les codes QR'
      );
    }
  };

  const startScanning = () => {
    setScanning(true);
    // Ici, vous activeriez le scanner de caméra
    // Pour l'exemple, on simule un scan après 2 secondes
    setTimeout(() => {
      simulateScan();
    }, 2000);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const simulateScan = () => {
    // Simulation d'un scan réussi
    const mockData = {
      type: 'PROSPECT',
      reference: 'PROS-001',
      data: {
        nom: 'Jean Dupont',
        telephone: '+2250123456789',
        email: 'jean.dupont@email.com',
        typeDocument: 'ACTE_NAISSANCE',
      },
      timestamp: new Date().toISOString(),
    };

    setScannedData(mockData);
    setScanning(false);
    setShowResultDialog(true);
  };

  const handleManualCode = () => {
    if (!manualCode.trim()) {
      setManualCodeError('Veuillez saisir un code');
      return;
    }

    // Validation basique du format
    if (manualCode.length < 5) {
      setManualCodeError('Le code doit contenir au moins 5 caractères');
      return;
    }

    setManualCodeError('');
    
    // Simuler un scan manuel
    const mockData = {
      type: 'MANUAL',
      reference: manualCode,
      data: {
        nom: 'Code saisi manuellement',
        telephone: 'N/A',
        email: 'N/A',
        typeDocument: 'INCONNU',
      },
      timestamp: new Date().toISOString(),
    };

    setScannedData(mockData);
    setShowManualDialog(false);
    setShowResultDialog(true);
    setManualCode('');
  };

  const processScannedData = () => {
    if (!scannedData) return;

    try {
      switch (scannedData.type) {
        case 'PROSPECT':
          // Traiter les données du prospect
          Alert.alert(
            'Prospect détecté',
            `Nom: ${scannedData.data.nom}\nTéléphone: ${scannedData.data.telephone}\nType de document: ${scannedData.data.typeDocument}`,
            [
              { text: 'Annuler', style: 'cancel' },
              { 
                text: 'Ajouter au prospect', 
                onPress: () => {
                  // Navigation vers l'ajout de prospect
                  navigation.navigate('Prospects');
                }
              }
            ]
          );
          break;

        case 'MANUAL':
          // Traiter le code saisi manuellement
          Alert.alert(
            'Code traité',
            `Code: ${scannedData.reference}\nType: ${scannedData.type}`,
            [
              { text: 'OK', onPress: () => setShowResultDialog(false) }
            ]
          );
          break;

        default:
          // Traiter d'autres types de données
          Alert.alert('Données scannées', JSON.stringify(scannedData, null, 2));
      }
    } catch (error) {
      console.error('Erreur lors du traitement des données:', error);
      Alert.alert('Erreur', 'Impossible de traiter les données scannées');
    }
  };

  const openSettings = () => {
    // Ouvrir les paramètres de l'application
    Alert.alert(
      'Paramètres',
      'Voulez-vous ouvrir les paramètres de l\'application ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Ouvrir', onPress: () => navigation.navigate('Settings') }
      ]
    );
  };

  const ScanOverlay = () => (
    <View style={styles.scanOverlay}>
      <View style={styles.scanFrame}>
        <View style={styles.corner} />
        <View style={[styles.corner, styles.cornerTopRight]} />
        <View style={[styles.corner, styles.cornerBottomLeft]} />
        <View style={[styles.corner, styles.cornerBottomRight]} />
      </View>
      <Text style={styles.scanInstructions}>
        Placez le code QR dans le cadre pour le scanner
      </Text>
    </View>
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
        <Title style={styles.headerTitle}>Scanner QR</Title>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={openSettings}
        >
          <Ionicons name="settings" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Zone de scan */}
      <View style={styles.scanContainer}>
        {scanning ? (
          <View style={styles.cameraContainer}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={64} color={theme.colors.primary} />
              <Text style={styles.cameraText}>Caméra active</Text>
              <Text style={styles.cameraSubtext}>Scannage en cours...</Text>
            </View>
            <ScanOverlay />
          </View>
        ) : (
          <View style={styles.scanPlaceholder}>
            <View style={styles.qrIconContainer}>
              <Ionicons name="qr-code" size={80} color={theme.colors.primary} />
            </View>
            <Title style={styles.scanTitle}>Scanner un code QR</Title>
            <Paragraph style={styles.scanSubtitle}>
              Utilisez votre caméra pour scanner les codes QR des prospects ou documents
            </Paragraph>
          </View>
        )}
      </View>

      {/* Contrôles */}
      <View style={styles.controls}>
        {scanning ? (
          <Button
            mode="contained"
            onPress={stopScanning}
            style={styles.stopButton}
            icon="stop"
            buttonColor={theme.colors.error}
          >
            Arrêter le scan
          </Button>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={startScanning}
              style={styles.scanButton}
              icon="camera"
              contentStyle={styles.buttonContent}
            >
              Démarrer le scan
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => setShowManualDialog(true)}
              style={styles.manualButton}
              icon="create"
              contentStyle={styles.buttonContent}
            >
              Saisir manuellement
            </Button>
          </View>
        )}
      </View>

      {/* Informations d'aide */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <Title style={styles.helpTitle}>Comment utiliser le scanner ?</Title>
          <View style={styles.helpSteps}>
            <View style={styles.helpStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>1</Text>
              </View>
              <Text style={styles.stepDescription}>
                Appuyez sur "Démarrer le scan" pour activer la caméra
              </Text>
            </View>
            <View style={styles.helpStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>2</Text>
              </View>
              <Text style={styles.stepDescription}>
                Pointez la caméra vers le code QR à scanner
              </Text>
            </View>
            <View style={styles.helpStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>3</Text>
              </View>
              <Text style={styles.stepDescription}>
                Le code sera automatiquement détecté et traité
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Dialog de résultat */}
      <Portal>
        <Dialog visible={showResultDialog} onDismiss={() => setShowResultDialog(false)}>
          <Dialog.Title>Code QR scanné</Dialog.Title>
          <Dialog.Content>
            {scannedData && (
              <View>
                <Text style={styles.resultText}>
                  <Text style={styles.resultLabel}>Type:</Text> {scannedData.type}
                </Text>
                <Text style={styles.resultText}>
                  <Text style={styles.resultLabel}>Référence:</Text> {scannedData.reference}
                </Text>
                {scannedData.data.nom && (
                  <Text style={styles.resultText}>
                    <Text style={styles.resultLabel}>Nom:</Text> {scannedData.data.nom}
                  </Text>
                )}
                {scannedData.data.telephone && (
                  <Text style={styles.resultText}>
                    <Text style={styles.resultLabel}>Téléphone:</Text> {scannedData.data.telephone}
                  </Text>
                )}
                {scannedData.data.typeDocument && (
                  <Text style={styles.resultText}>
                    <Text style={styles.resultLabel}>Document:</Text> {scannedData.data.typeDocument}
                  </Text>
                )}
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowResultDialog(false)}>Fermer</Button>
            <Button onPress={processScannedData} mode="contained">
              Traiter
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog de saisie manuelle */}
      <Portal>
        <Dialog visible={showManualDialog} onDismiss={() => setShowManualDialog(false)}>
          <Dialog.Title>Saisir un code manuellement</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Code ou référence"
              value={manualCode}
              onChangeText={(text) => {
                setManualCode(text);
                if (manualCodeError) setManualCodeError('');
              }}
              mode="outlined"
              placeholder="Ex: PROS-001 ou 123456789"
              style={styles.dialogInput}
              error={!!manualCodeError}
            />
            {manualCodeError && (
              <HelperText type="error" visible={!!manualCodeError}>
                {manualCodeError}
              </HelperText>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowManualDialog(false)}>Annuler</Button>
            <Button onPress={handleManualCode} mode="contained">
              Valider
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
  settingsButton: {
    padding: theme.spacing.sm,
  },
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  cameraContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  cameraPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
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
  scanPlaceholder: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  qrIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  scanSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: theme.colors.primary,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    top: 'auto',
    borderTopWidth: 0,
    borderBottomWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanInstructions: {
    position: 'absolute',
    bottom: -60,
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  controls: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  scanButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  manualButton: {
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  stopButton: {
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  helpCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  helpSteps: {
    gap: theme.spacing.md,
  },
  helpStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  stepText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepDescription: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  resultText: {
    fontSize: 16,
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
  },
  resultLabel: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  dialogInput: {
    marginTop: theme.spacing.md,
  },
});