import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    Usr_reference: '',
    Usr_Nom: '',
    Usr_Prenom: '',
    Usr_Email: '',
    Usr_Contact: '',
    Usr_Password: '',
    Usr_PasswordConfirm: '',
    Loc_reference: '',
    Ref_TypeCompte: 'USER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Usr_reference.trim()) {
      newErrors.Usr_reference = 'La référence est requise';
    }

    if (!formData.Usr_Nom.trim()) {
      newErrors.Usr_Nom = 'Le nom est requis';
    }

    if (!formData.Usr_Prenom.trim()) {
      newErrors.Usr_Prenom = 'Le prénom est requis';
    }

    if (!formData.Usr_Contact.trim()) {
      newErrors.Usr_Contact = 'Le numéro de téléphone est requis';
    } else if (!/^[0-9]{10}$/.test(formData.Usr_Contact)) {
      newErrors.Usr_Contact = 'Le numéro de téléphone doit contenir 10 chiffres';
    }

    if (!formData.Usr_Password) {
      newErrors.Usr_Password = 'Le mot de passe est requis';
    } else if (formData.Usr_Password.length < 6) {
      newErrors.Usr_Password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.Usr_Password !== formData.Usr_PasswordConfirm) {
      newErrors.Usr_PasswordConfirm = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      if (!result.success) {
        Alert.alert('Erreur d\'inscription', result.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Title style={styles.headerTitle}>Créer un compte</Title>
        </View>

        {/* Formulaire d'inscription */}
        <Card style={styles.registerCard}>
          <Card.Content>
            <Title style={styles.registerTitle}>Inscription</Title>
            <Paragraph style={styles.registerSubtitle}>
              Remplissez les informations pour créer votre compte
            </Paragraph>

            {/* Référence utilisateur */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Référence utilisateur *"
                value={formData.Usr_reference}
                onChangeText={(value) => updateFormData('Usr_reference', value)}
                mode="outlined"
                left={<TextInput.Icon icon="person" />}
                style={styles.input}
                error={!!errors.Usr_reference}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    outline: theme.colors.divider,
                    error: theme.colors.error,
                  },
                }}
              />
              {errors.Usr_reference && (
                <HelperText type="error" visible={!!errors.Usr_reference}>
                  {errors.Usr_reference}
                </HelperText>
              )}
            </View>

            {/* Nom et Prénom */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <TextInput
                  label="Nom *"
                  value={formData.Usr_Nom}
                  onChangeText={(value) => updateFormData('Usr_Nom', value)}
                  mode="outlined"
                  left={<TextInput.Icon icon="person" />}
                  style={styles.input}
                  error={!!errors.Usr_Nom}
                  theme={{
                    colors: {
                      primary: theme.colors.primary,
                      outline: theme.colors.divider,
                      error: theme.colors.error,
                    },
                  }}
                />
                {errors.Usr_Nom && (
                  <HelperText type="error" visible={!!errors.Usr_Nom}>
                    {errors.Usr_Nom}
                  </HelperText>
                )}
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <TextInput
                  label="Prénom *"
                  value={formData.Usr_Prenom}
                  onChangeText={(value) => updateFormData('Usr_Prenom', value)}
                  mode="outlined"
                  left={<TextInput.Icon icon="person" />}
                  style={styles.input}
                  error={!!errors.Usr_Prenom}
                  theme={{
                    colors: {
                      primary: theme.colors.primary,
                      outline: theme.colors.divider,
                      error: theme.colors.error,
                    },
                  }}
                />
                {errors.Usr_Prenom && (
                  <HelperText type="error" visible={!!errors.Usr_Prenom}>
                    {errors.Usr_Prenom}
                  </HelperText>
                )}
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                value={formData.Usr_Email}
                onChangeText={(value) => updateFormData('Usr_Email', value)}
                mode="outlined"
                keyboardType="email-address"
                left={<TextInput.Icon icon="mail" />}
                style={styles.input}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    outline: theme.colors.divider,
                  },
                }}
              />
            </View>

            {/* Numéro de téléphone */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Numéro de téléphone *"
                value={formData.Usr_Contact}
                onChangeText={(value) => updateFormData('Usr_Contact', value)}
                mode="outlined"
                keyboardType="phone-pad"
                left={<TextInput.Icon icon="phone" />}
                style={styles.input}
                error={!!errors.Usr_Contact}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    outline: theme.colors.divider,
                    error: theme.colors.error,
                  },
                }}
              />
              {errors.Usr_Contact && (
                <HelperText type="error" visible={!!errors.Usr_Contact}>
                  {errors.Usr_Contact}
                </HelperText>
              )}
            </View>

            {/* Mot de passe */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Mot de passe *"
                value={formData.Usr_Password}
                onChangeText={(value) => updateFormData('Usr_Password', value)}
                mode="outlined"
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                error={!!errors.Usr_Password}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    outline: theme.colors.divider,
                    error: theme.colors.error,
                  },
                }}
              />
              {errors.Usr_Password && (
                <HelperText type="error" visible={!!errors.Usr_Password}>
                  {errors.Usr_Password}
                </HelperText>
              )}
            </View>

            {/* Confirmation mot de passe */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Confirmer le mot de passe *"
                value={formData.Usr_PasswordConfirm}
                onChangeText={(value) => updateFormData('Usr_PasswordConfirm', value)}
                mode="outlined"
                secureTextEntry={!showPasswordConfirm}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPasswordConfirm ? 'eye-off' : 'eye'}
                    onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  />
                }
                style={styles.input}
                error={!!errors.Usr_PasswordConfirm}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    outline: theme.colors.divider,
                    error: theme.colors.error,
                  },
                }}
              />
              {errors.Usr_PasswordConfirm && (
                <HelperText type="error" visible={!!errors.Usr_PasswordConfirm}>
                  {errors.Usr_PasswordConfirm}
                </HelperText>
              )}
            </View>

            {/* Bouton d'inscription */}
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              contentStyle={styles.registerButtonContent}
              labelStyle={styles.registerButtonLabel}
            >
              Créer le compte
            </Button>
          </Card.Content>
        </Card>

        {/* Section connexion */}
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  registerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  registerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  registerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  registerButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  registerButtonContent: {
    paddingVertical: theme.spacing.sm,
  },
  registerButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  loginText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  loginButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  loginButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});