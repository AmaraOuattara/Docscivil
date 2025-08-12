import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  List,
  Divider,
  Dialog,
  Portal,
  TextInput,
  HelperText,
  Switch,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [formData, setFormData] = useState({
    Usr_Nom: user?.Usr_Nom || '',
    Usr_Prenom: user?.Usr_Prenom || '',
    Usr_Email: user?.Usr_Email || '',
    Usr_Contact: user?.Usr_Contact || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleEditProfile = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateUser(formData);
      Alert.alert('Succès', 'Profil mis à jour avec succès');
      setShowEditDialog(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      // Ici, vous appelleriez l'API pour changer le mot de passe
      Alert.alert('Succès', 'Mot de passe modifié avec succès');
      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // La navigation sera gérée automatiquement par le contexte d'authentification
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Usr_Nom.trim()) {
      newErrors.Usr_Nom = 'Le nom est requis';
    }
    if (!formData.Usr_Prenom.trim()) {
      newErrors.Usr_Prenom = 'Le prénom est requis';
    }
    if (!formData.Usr_Contact.trim()) {
      newErrors.Usr_Contact = 'Le contact est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Le mot de passe actuel est requis';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const ProfileSection = ({ title, children }) => (
    <View style={styles.section}>
      <Title style={styles.sectionTitle}>{title}</Title>
      {children}
    </View>
  );

  const ProfileCard = ({ icon, title, subtitle, onPress, showArrow = true }) => (
    <TouchableOpacity onPress={onPress} style={styles.profileCard}>
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
          {showArrow && (
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header du profil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={80}
              label={`${user?.Usr_Prenom?.[0] || 'U'}${user?.Usr_Nom?.[0] || 'S'}`}
              style={styles.avatar}
              color={theme.colors.primary}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Title style={styles.userName}>
            {user?.Usr_Prenom} {user?.Usr_Nom}
          </Title>
          <Paragraph style={styles.userRole}>
            {user?.Ref_TypeCompte === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
          </Paragraph>
          <Button
            mode="outlined"
            onPress={() => setShowEditDialog(true)}
            style={styles.editProfileButton}
            icon="pencil"
          >
            Modifier le profil
          </Button>
        </View>

        {/* Informations personnelles */}
        <ProfileSection title="Informations personnelles">
          <Card style={styles.infoCard}>
            <Card.Content>
              <List.Item
                title="Nom complet"
                description={`${user?.Usr_Prenom} ${user?.Usr_Nom}`}
                left={(props) => <List.Icon {...props} icon="account" />}
              />
              <Divider />
              <List.Item
                title="Email"
                description={user?.Usr_Email || 'Non renseigné'}
                left={(props) => <List.Icon {...props} icon="email" />}
              />
              <Divider />
              <List.Item
                title="Téléphone"
                description={user?.Usr_Contact}
                left={(props) => <List.Icon {...props} icon="phone" />}
              />
              <Divider />
              <List.Item
                title="Référence"
                description={user?.Usr_reference}
                left={(props) => <List.Icon {...props} icon="tag" />}
              />
            </Card.Content>
          </Card>
        </ProfileSection>

        {/* Paramètres du compte */}
        <ProfileSection title="Paramètres du compte">
          <ProfileCard
            icon="lock-closed"
            title="Changer le mot de passe"
            subtitle="Modifier votre mot de passe de connexion"
            onPress={() => setShowPasswordDialog(true)}
          />
          <ProfileCard
            icon="notifications"
            title="Notifications"
            subtitle="Gérer les notifications push"
            onPress={() => {}}
            showArrow={false}
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Activer les notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              color={theme.colors.primary}
            />
          </View>
        </ProfileSection>

        {/* Paramètres de l'application */}
        <ProfileSection title="Paramètres de l'application">
          <ProfileCard
            icon="color-palette"
            title="Thème"
            subtitle="Personnaliser l'apparence"
            onPress={() => {}}
          />
          <ProfileCard
            icon="language"
            title="Langue"
            subtitle="Français"
            onPress={() => {}}
          />
          <ProfileCard
            icon="information-circle"
            title="À propos"
            subtitle="Version 1.0.0"
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Support et aide */}
        <ProfileSection title="Support et aide">
          <ProfileCard
            icon="help-circle"
            title="Centre d'aide"
            subtitle="Tutoriels et FAQ"
            onPress={() => {}}
          />
          <ProfileCard
            icon="chatbubble-ellipses"
            title="Nous contacter"
            subtitle="Support technique"
            onPress={() => {}}
          />
          <ProfileCard
            icon="document-text"
            title="Conditions d'utilisation"
            subtitle="Lire les conditions"
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Déconnexion */}
        <View style={styles.logoutSection}>
          <Button
            mode="contained"
            onPress={() => setShowLogoutDialog(true)}
            style={styles.logoutButton}
            icon="log-out-outline"
            buttonColor={theme.colors.error}
          >
            Se déconnecter
          </Button>
        </View>
      </ScrollView>

      {/* Dialog de modification du profil */}
      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>Modifier le profil</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nom *"
              value={formData.Usr_Nom}
              onChangeText={(text) => setFormData(prev => ({ ...prev, Usr_Nom: text }))}
              mode="outlined"
              style={styles.dialogInput}
              error={!!errors.Usr_Nom}
            />
            {errors.Usr_Nom && (
              <HelperText type="error" visible={!!errors.Usr_Nom}>
                {errors.Usr_Nom}
              </HelperText>
            )}

            <TextInput
              label="Prénom *"
              value={formData.Usr_Prenom}
              onChangeText={(text) => setFormData(prev => ({ ...prev, Usr_Prenom: text }))}
              mode="outlined"
              style={styles.dialogInput}
              error={!!errors.Usr_Prenom}
            />
            {errors.Usr_Prenom && (
              <HelperText type="error" visible={!!errors.Usr_Prenom}>
                {errors.Usr_Prenom}
              </HelperText>
            )}

            <TextInput
              label="Email"
              value={formData.Usr_Email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, Usr_Email: text }))}
              mode="outlined"
              keyboardType="email-address"
              style={styles.dialogInput}
            />

            <TextInput
              label="Téléphone *"
              value={formData.Usr_Contact}
              onChangeText={(text) => setFormData(prev => ({ ...prev, Usr_Contact: text }))}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.dialogInput}
              error={!!errors.Usr_Contact}
            />
            {errors.Usr_Contact && (
              <HelperText type="error" visible={!!errors.Usr_Contact}>
                {errors.Usr_Contact}
              </HelperText>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>Annuler</Button>
            <Button onPress={handleEditProfile} mode="contained" loading={loading}>
              Enregistrer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog de changement de mot de passe */}
      <Portal>
        <Dialog visible={showPasswordDialog} onDismiss={() => setShowPasswordDialog(false)}>
          <Dialog.Title>Changer le mot de passe</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Mot de passe actuel *"
              value={passwordData.currentPassword}
              onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
              mode="outlined"
              secureTextEntry
              style={styles.dialogInput}
              error={!!passwordErrors.currentPassword}
            />
            {passwordErrors.currentPassword && (
              <HelperText type="error" visible={!!passwordErrors.currentPassword}>
                {passwordErrors.currentPassword}
              </HelperText>
            )}

            <TextInput
              label="Nouveau mot de passe *"
              value={passwordData.newPassword}
              onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
              mode="outlined"
              secureTextEntry
              style={styles.dialogInput}
              error={!!passwordErrors.newPassword}
            />
            {passwordErrors.newPassword && (
              <HelperText type="error" visible={!!passwordErrors.newPassword}>
                {passwordErrors.newPassword}
              </HelperText>
            )}

            <TextInput
              label="Confirmer le nouveau mot de passe *"
              value={passwordData.confirmPassword}
              onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
              mode="outlined"
              secureTextEntry
              style={styles.dialogInput}
              error={!!passwordErrors.confirmPassword}
            />
            {passwordErrors.confirmPassword && (
              <HelperText type="error" visible={!!passwordErrors.confirmPassword}>
                {passwordErrors.confirmPassword}
              </HelperText>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPasswordDialog(false)}>Annuler</Button>
            <Button onPress={handleChangePassword} mode="contained" loading={loading}>
              Changer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog de confirmation de déconnexion */}
      <Portal>
        <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
          <Dialog.Title>Confirmer la déconnexion</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogoutDialog(false)}>Annuler</Button>
            <Button onPress={handleLogout} textColor={theme.colors.error}>
              Se déconnecter
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    backgroundColor: theme.colors.primaryLight,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userRole: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  editProfileButton: {
    borderColor: theme.colors.primary,
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
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  profileCard: {
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  switchLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  logoutSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  logoutButton: {
    borderRadius: theme.borderRadius.md,
  },
  dialogInput: {
    marginBottom: theme.spacing.md,
  },
});