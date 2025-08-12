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
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!contact.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const result = await login(contact, password);
      if (!result.success) {
        Alert.alert('Erreur de connexion', result.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
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
        {/* Header avec logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="document-text" size={80} color={theme.colors.primary} />
          </View>
          <Title style={styles.appTitle}>DocsCivil CI</Title>
          <Paragraph style={styles.appSubtitle}>
            Gestion des documents civils
          </Paragraph>
        </View>

        {/* Formulaire de connexion */}
        <Card style={styles.loginCard}>
          <Card.Content>
            <Title style={styles.loginTitle}>Connexion</Title>
            <Paragraph style={styles.loginSubtitle}>
              Connectez-vous à votre compte
            </Paragraph>

            {/* Champ numéro de téléphone */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Numéro de téléphone"
                value={contact}
                onChangeText={setContact}
                mode="outlined"
                keyboardType="phone-pad"
                left={<TextInput.Icon icon="phone" />}
                style={styles.input}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    outline: theme.colors.divider,
                  },
                }}
              />
            </View>

            {/* Champ mot de passe */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Mot de passe"
                value={password}
                onChangeText={setPassword}
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
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    outline: theme.colors.divider,
                  },
                }}
              />
            </View>

            {/* Bouton de connexion */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
              labelStyle={styles.loginButtonLabel}
            >
              Se connecter
            </Button>

            {/* Lien mot de passe oublié */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Section inscription */}
        <View style={styles.registerSection}>
          <Text style={styles.registerText}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerButton}
          >
            <Text style={styles.registerButtonText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 DocsCivil CI. Tous droits réservés.
          </Text>
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
    alignItems: 'center',
    marginTop: height * 0.1,
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  appSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  loginButtonContent: {
    paddingVertical: theme.spacing.sm,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  registerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  registerText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  registerButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  registerButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});