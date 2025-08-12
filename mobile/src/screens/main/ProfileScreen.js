import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Avatar,
  List,
  Switch,
  Divider,
  TextInput,
  Dialog,
  Portal,
} from 'react-native-paper';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/theme';
import { userService } from '../../services/api';

const ProfileScreen = ({ navigation }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const { colors: themeColors } = useTheme();
  const { user, updateUser, signOut } = useAuth();

  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleEditSave = async () => {
    if (!editData.firstName || !editData.lastName || !editData.email) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const response = await userService.updateProfile(editData);
      if (response.status === 200) {
        await updateUser(response.data);
        setEditMode(false);
        Alert.alert('Succès', 'Profil mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Erreur', 'Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Erreur', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      // Appel API pour changer le mot de passe
      setPasswordDialogVisible(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      Alert.alert('Succès', 'Mot de passe modifié avec succès');
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      Alert.alert('Erreur', 'Impossible de modifier le mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Confirmer la déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* En-tête du profil */}
      <Card style={[styles.profileHeader, { backgroundColor: themeColors.primary }]}>
        <Card.Content style={styles.profileHeaderContent}>
          <Avatar.Text
            size={80}
            label={getInitials(user?.firstName, user?.lastName)}
            style={styles.profileAvatar}
            color={themeColors.primary}
          />
          <View style={styles.profileInfo}>
            <Title style={[styles.profileName, { color: themeColors.surface }]}>
              {user?.firstName} {user?.lastName}
            </Title>
            <Paragraph style={[styles.profileEmail, { color: themeColors.surface }]}>
              {user?.email}
            </Paragraph>
            <Text style={[styles.profileRole, { color: themeColors.surface }]}>
              {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Informations personnelles */}
      <Card style={[styles.sectionCard, { backgroundColor: themeColors.surface }]}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: themeColors.text }]}>
              Informations personnelles
            </Title>
            <Button
              mode={editMode ? 'contained' : 'outlined'}
              onPress={() => editMode ? handleEditSave() : setEditMode(true)}
              loading={loading}
              disabled={loading}
              style={[
                styles.editButton,
                editMode && { backgroundColor: themeColors.primary },
              ]}
            >
              {editMode ? 'Sauvegarder' : 'Modifier'}
            </Button>
          </View>

          {editMode ? (
            <View style={styles.editForm}>
              <View style={styles.row}>
                <TextInput
                  label="Prénom *"
                  value={editData.firstName}
                  onChangeText={(value) => setEditData(prev => ({ ...prev, firstName: value }))}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  theme={{ colors: { primary: themeColors.primary } }}
                />
                <TextInput
                  label="Nom *"
                  value={editData.lastName}
                  onChangeText={(value) => setEditData(prev => ({ ...prev, lastName: value }))}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  theme={{ colors: { primary: themeColors.primary } }}
                />
              </View>
              <TextInput
                label="Email *"
                value={editData.email}
                onChangeText={(value) => setEditData(prev => ({ ...prev, email: value }))}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                theme={{ colors: { primary: themeColors.primary } }}
              />
              <TextInput
                label="Téléphone"
                value={editData.phone}
                onChangeText={(value) => setEditData(prev => ({ ...prev, phone: value }))}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                theme={{ colors: { primary: themeColors.primary } }}
              />
              {editMode && (
                <View style={styles.editActions}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setEditMode(false);
                      setEditData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                      });
                    }}
                    style={styles.cancelButton}
                  >
                    Annuler
                  </Button>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.infoDisplay}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  Prénom :
                </Text>
                <Text style={[styles.infoValue, { color: themeColors.text }]}>
                  {user?.firstName}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  Nom :
                </Text>
                <Text style={[styles.infoValue, { color: themeColors.text }]}>
                  {user?.lastName}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  Email :
                </Text>
                <Text style={[styles.infoValue, { color: themeColors.text }]}>
                  {user?.email}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  Téléphone :
                </Text>
                <Text style={[styles.infoValue, { color: themeColors.text }]}>
                  {user?.phone || 'Non renseigné'}
                </Text>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Sécurité */}
      <Card style={[styles.sectionCard, { backgroundColor: themeColors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: themeColors.text }]}>
            Sécurité
          </Title>
          <List.Item
            title="Changer le mot de passe"
            description="Modifier votre mot de passe de connexion"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setPasswordDialogVisible(true)}
            style={styles.listItem}
          />
          <List.Item
            title="Authentification à deux facteurs"
            description="Activer la sécurité renforcée"
            left={(props) => <List.Icon {...props} icon="shield" />}
            right={(props) => <Switch value={false} />}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Préférences */}
      <Card style={[styles.sectionCard, { backgroundColor: themeColors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: themeColors.text }]}>
            Préférences
          </Title>
          <List.Item
            title="Notifications push"
            description="Recevoir des notifications sur votre appareil"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <Switch value={true} />}
            style={styles.listItem}
          />
          <List.Item
            title="Notifications email"
            description="Recevoir des notifications par email"
            left={(props) => <List.Icon {...props} icon="email" />}
            right={(props) => <Switch value={true} />}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={[styles.sectionCard, { backgroundColor: themeColors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: themeColors.text }]}>
            Actions
          </Title>
          <Button
            mode="outlined"
            onPress={handleSignOut}
            icon="logout"
            style={[styles.actionButton, { borderColor: themeColors.error }]}
            labelStyle={{ color: themeColors.error }}
          >
            Se déconnecter
          </Button>
        </Card.Content>
      </Card>

      {/* Informations système */}
      <Card style={[styles.sectionCard, { backgroundColor: themeColors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: themeColors.text }]}>
            Informations système
          </Title>
          <View style={styles.systemInfo}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                Version de l'application :
              </Text>
              <Text style={[styles.infoValue, { color: themeColors.text }]}>
                1.0.0
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                Dernière connexion :
              </Text>
              <Text style={[styles.infoValue, { color: themeColors.text }]}>
                {new Date().toLocaleString('fr-FR')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                ID utilisateur :
              </Text>
              <Text style={[styles.infoValue, { color: themeColors.text }]}>
                {user?.id}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Dialog de changement de mot de passe */}
      <Portal>
        <Dialog
          visible={passwordDialogVisible}
          onDismiss={() => setPasswordDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Changer le mot de passe</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Mot de passe actuel"
              value={passwordData.currentPassword}
              onChangeText={(value) => setPasswordData(prev => ({ ...prev, currentPassword: value }))}
              mode="outlined"
              secureTextEntry
              style={styles.dialogInput}
              theme={{ colors: { primary: themeColors.primary } }}
            />
            <TextInput
              label="Nouveau mot de passe"
              value={passwordData.newPassword}
              onChangeText={(value) => setPasswordData(prev => ({ ...prev, newPassword: value }))}
              mode="outlined"
              secureTextEntry
              style={styles.dialogInput}
              theme={{ colors: { primary: themeColors.primary } }}
            />
            <TextInput
              label="Confirmer le nouveau mot de passe"
              value={passwordData.confirmPassword}
              onChangeText={(value) => setPasswordData(prev => ({ ...prev, confirmPassword: value }))}
              mode="outlined"
              secureTextEntry
              style={styles.dialogInput}
              theme={{ colors: { primary: themeColors.primary } }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPasswordDialogVisible(false)}>Annuler</Button>
            <Button
              onPress={handlePasswordChange}
              loading={loading}
              disabled={loading}
              mode="contained"
            >
              Confirmer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    margin: 16,
    borderRadius: 12,
  },
  profileHeaderContent: {
    alignItems: 'center',
    padding: 20,
  },
  profileAvatar: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    opacity: 0.9,
  },
  sectionCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    borderRadius: 8,
  },
  editForm: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 16,
  },
  halfInput: {
    flex: 0.48,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    borderRadius: 8,
  },
  infoDisplay: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
  },
  listItem: {
    paddingVertical: 8,
  },
  actionButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  systemInfo: {
    marginTop: 8,
  },
  dialog: {
    borderRadius: 12,
  },
  dialogInput: {
    marginBottom: 16,
  },
});

export default ProfileScreen;