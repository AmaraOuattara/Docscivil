import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  List,
  Divider,
  Dialog,
  Portal,
  Button,
  TextInput,
  HelperText,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export default function SettingsScreen({ navigation }) {
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [backupEmail, setBackupEmail] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleBackup = async () => {
    if (!backupEmail.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email');
      return;
    }

    try {
      // Simulation de sauvegarde
      Alert.alert('Succès', 'Sauvegarde initiée avec succès');
      setShowBackupDialog(false);
      setBackupEmail('');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'initier la sauvegarde');
    }
  };

  const handleClearData = async () => {
    try {
      // Simulation de suppression des données
      Alert.alert('Succès', 'Données supprimées avec succès');
      setShowClearDataDialog(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer les données');
    }
  };

  const handleExport = async () => {
    try {
      // Simulation d'export
      Alert.alert('Succès', 'Export initié avec succès');
      setShowExportDialog(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'initier l\'export');
    }
  };

  const SettingsSection = ({ title, children }) => (
    <View style={styles.section}>
      <Title style={styles.sectionTitle}>{title}</Title>
      {children}
    </View>
  );

  const SettingsCard = ({ icon, title, subtitle, onPress, showArrow = true, rightComponent }) => (
    <TouchableOpacity onPress={onPress} style={styles.settingsCard}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Title style={styles.cardTitle}>{title}</Title>
              {subtitle && (
                <Paragraph style={styles.cardSubtitle}>{subtitle}</Paragraph>
              )}
            </View>
          </View>
          {rightComponent || (showArrow && (
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          ))}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Paramètres de l'application */}
        <SettingsSection title="Paramètres de l'application">
          <SettingsCard
            icon="notifications"
            title="Notifications"
            subtitle="Gérer les notifications push"
            onPress={() => {}}
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.colors.primary}
              />
            }
            showArrow={false}
          />
          
          <SettingsCard
            icon="color-palette"
            title="Mode sombre"
            subtitle="Activer le thème sombre"
            onPress={() => {}}
            rightComponent={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                color={theme.colors.primary}
              />
            }
            showArrow={false}
          />

          <SettingsCard
            icon="sync"
            title="Synchronisation automatique"
            subtitle="Synchroniser automatiquement les données"
            onPress={() => {}}
            rightComponent={
              <Switch
                value={autoSyncEnabled}
                onValueChange={setAutoSyncEnabled}
                color={theme.colors.primary}
              />
            }
            showArrow={false}
          />

          <SettingsCard
            icon="location"
            title="Localisation"
            subtitle="Autoriser l'accès à la localisation"
            onPress={() => {}}
            rightComponent={
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                color={theme.colors.primary}
              />
            }
            showArrow={false}
          />

          <SettingsCard
            icon="finger-print"
            title="Authentification biométrique"
            subtitle="Utiliser l'empreinte digitale ou Face ID"
            onPress={() => {}}
            rightComponent={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                color={theme.colors.primary}
              />
            }
            showArrow={false}
          />
        </SettingsSection>

        {/* Paramètres de sécurité */}
        <SettingsSection title="Sécurité">
          <SettingsCard
            icon="lock-closed"
            title="Changer le mot de passe"
            subtitle="Modifier votre mot de passe de connexion"
            onPress={() => navigation.navigate('Profile')}
          />
          
          <SettingsCard
            icon="shield-checkmark"
            title="Authentification à deux facteurs"
            subtitle="Ajouter une couche de sécurité supplémentaire"
            onPress={() => {}}
          />

          <SettingsCard
            icon="key"
            title="Gestion des sessions"
            subtitle="Gérer les appareils connectés"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Paramètres de données */}
        <SettingsSection title="Données et stockage">
          <SettingsCard
            icon="cloud-upload"
            title="Sauvegarde"
            subtitle="Sauvegarder vos données sur le cloud"
            onPress={() => setShowBackupDialog(true)}
          />

          <SettingsCard
            icon="download"
            title="Exporter les données"
            subtitle="Exporter vos données au format CSV/PDF"
            onPress={() => setShowExportDialog(true)}
          />

          <SettingsCard
            icon="trash"
            title="Effacer les données"
            subtitle="Supprimer toutes les données locales"
            onPress={() => setShowClearDataDialog(true)}
          />

          <SettingsCard
            icon="storage"
            title="Espace de stockage"
            subtitle="Gérer l'espace de stockage utilisé"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Paramètres de l'interface */}
        <SettingsSection title="Interface utilisateur">
          <SettingsCard
            icon="text"
            title="Taille du texte"
            subtitle="Ajuster la taille du texte"
            onPress={() => {}}
          />

          <SettingsCard
            icon="language"
            title="Langue"
            subtitle="Français"
            onPress={() => {}}
          />

          <SettingsCard
            icon="time"
            title="Format de date et heure"
            subtitle="Personnaliser l'affichage des dates"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Paramètres avancés */}
        <SettingsSection title="Paramètres avancés">
          <SettingsCard
            icon="bug"
            title="Mode développeur"
            subtitle="Activer les options de développement"
            onPress={() => {}}
          />

          <SettingsCard
            icon="analytics"
            title="Statistiques d'utilisation"
            subtitle="Voir les statistiques de l'application"
            onPress={() => {}}
          />

          <SettingsCard
            icon="information-circle"
            title="Logs de débogage"
            subtitle="Afficher les logs de l'application"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Informations sur l'application */}
        <SettingsSection title="À propos">
          <Card style={styles.infoCard}>
            <Card.Content>
              <List.Item
                title="Version"
                description="1.0.0"
                left={(props) => <List.Icon {...props} icon="information" />}
              />
              <Divider />
              <List.Item
                title="Dernière mise à jour"
                description="15 janvier 2024"
                left={(props) => <List.Icon {...props} icon="calendar" />}
              />
              <Divider />
              <List.Item
                title="Taille de l'application"
                description="45.2 MB"
                left={(props) => <List.Icon {...props} icon="hardware-chip" />}
              />
              <Divider />
              <List.Item
                title="Développeur"
                description="DocsCivil CI Team"
                left={(props) => <List.Icon {...props} icon="code" />}
              />
            </Card.Content>
          </Card>
        </SettingsSection>
      </ScrollView>

      {/* Dialog de sauvegarde */}
      <Portal>
        <Dialog visible={showBackupDialog} onDismiss={() => setShowBackupDialog(false)}>
          <Dialog.Title>Configurer la sauvegarde</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogDescription}>
              Entrez votre adresse email pour recevoir un lien de sauvegarde de vos données.
            </Paragraph>
            <TextInput
              label="Adresse email"
              value={backupEmail}
              onChangeText={setBackupEmail}
              mode="outlined"
              keyboardType="email-address"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowBackupDialog(false)}>Annuler</Button>
            <Button onPress={handleBackup} mode="contained">
              Sauvegarder
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog de confirmation de suppression */}
      <Portal>
        <Dialog visible={showClearDataDialog} onDismiss={() => setShowClearDataDialog(false)}>
          <Dialog.Title>Confirmer la suppression</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Êtes-vous sûr de vouloir supprimer toutes les données locales ? 
              Cette action est irréversible et supprimera tous vos prospects, documents et paramètres.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDataDialog(false)}>Annuler</Button>
            <Button onPress={handleClearData} textColor={theme.colors.error}>
              Supprimer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog d'export */}
      <Portal>
        <Dialog visible={showExportDialog} onDismiss={() => setShowExportDialog(false)}>
          <Dialog.Title>Exporter les données</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogDescription}>
              Choisissez le format d'export et la destination pour vos données.
            </Paragraph>
            <View style={styles.exportOptions}>
              <Button
                mode="outlined"
                onPress={() => handleExport()}
                style={styles.exportButton}
                icon="file-document"
              >
                Export PDF
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleExport()}
                style={styles.exportButton}
                icon="table"
              >
                Export CSV
              </Button>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExportDialog(false)}>Fermer</Button>
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
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingsCard: {
    marginBottom: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  cardContent: {
    paddingVertical: theme.spacing.sm,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  dialogDescription: {
    marginBottom: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  dialogInput: {
    marginTop: theme.spacing.md,
  },
  exportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
  },
  exportButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});