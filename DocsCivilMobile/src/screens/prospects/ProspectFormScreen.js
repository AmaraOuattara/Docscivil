import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';
import ApiService from '../../services/apiService';

const ProspectFormScreen = ({ navigation, route }) => {
  const { prospect } = route.params || {};
  const isEditing = !!prospect;

  const [formData, setFormData] = useState({
    reference: '',
    nom: '',
    prenom: '',
    civilite: '',
    contact: '',
    listeReference: '',
    statut: 'ACTIF',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [listeDiffusion, setListeDiffusion] = useState([]);

  const civiliteOptions = ['M.', 'Mme', 'Mlle', 'Dr.', 'Prof.'];
  const statutOptions = ['ACTIF', 'INACTIF', 'SUSPENDU'];

  useEffect(() => {
    loadListeDiffusion();
    if (isEditing) {
      populateForm();
    } else {
      generateReference();
    }
  }, []);

  const loadListeDiffusion = async () => {
    try {
      // This would be a call to get liste diffusion data
      // For now, we'll use mock data since the API doesn't seem to have this endpoint
      setListeDiffusion([
        { lst_reference: 'LST_001', lst_libelle: 'Liste Principale' },
        { lst_reference: 'LST_002', lst_libelle: 'Liste Secondaire' },
        { lst_reference: 'LST_003', lst_libelle: 'Liste VIP' },
      ]);
    } catch (error) {
      console.log('Error loading liste diffusion:', error);
    }
  };

  const populateForm = () => {
    setFormData({
      reference: prospect.clt_reference,
      nom: prospect.clt_nom,
      prenom: prospect.clt_prenom,
      civilite: prospect.clt_civilite,
      contact: prospect.clt_contact,
      listeReference: prospect.lst_reference,
      statut: prospect.Statut_client,
    });
  };

  const generateReference = () => {
    const timestamp = Date.now();
    const reference = `PROS_${timestamp.toString().slice(-6)}`;
    setFormData(prev => ({ ...prev, reference }));
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.reference.trim()) {
      newErrors.reference = 'La référence est requise';
    }

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }

    if (!formData.civilite.trim()) {
      newErrors.civilite = 'La civilité est requise';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Le contact est requis';
    } else if (!/^\+?[\d\s-()]{8,}$/.test(formData.contact)) {
      newErrors.contact = 'Format de téléphone invalide';
    }

    if (!formData.listeReference.trim()) {
      newErrors.listeReference = 'La liste de diffusion est requise';
    }

    if (!formData.statut.trim()) {
      newErrors.statut = 'Le statut est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const prospectData = {
        clt_reference: formData.reference.trim(),
        clt_nom: formData.nom.trim(),
        clt_prenom: formData.prenom.trim(),
        clt_civilite: formData.civilite,
        clt_contact: formData.contact.trim(),
        lst_reference: formData.listeReference,
        Statut_client: formData.statut,
      };

      let response;
      if (isEditing) {
        response = await ApiService.updateProspect(prospect.Id_clt, prospectData);
      } else {
        response = await ApiService.createProspect(prospectData);
      }

      if (response.success !== false) {
        Alert.alert(
          'Succès',
          isEditing ? 'Prospect modifié avec succès' : 'Prospect créé avec succès',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Erreur', response.message || 'Une erreur est survenue');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!isEditing) return;

    Alert.alert(
      'Supprimer le prospect',
      `Êtes-vous sûr de vouloir supprimer ${formData.nom} ${formData.prenom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: deleteProspect,
        },
      ]
    );
  };

  const deleteProspect = async () => {
    setLoading(true);
    try {
      await ApiService.deleteProspect(prospect.Id_clt);
      Alert.alert(
        'Succès',
        'Prospect supprimé avec succès',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer le prospect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Modifier Prospect' : 'Nouveau Prospect'}
          </Text>
          {isEditing && (
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color={COLORS.error} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            {/* Reference */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Référence *</Text>
              <View style={[styles.inputWrapper, errors.reference && styles.inputError]}>
                <Ionicons name="id-card-outline" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={[styles.input, isEditing && styles.disabledInput]}
                  value={formData.reference}
                  onChangeText={(value) => updateFormData('reference', value)}
                  placeholder="Référence du prospect"
                  editable={!isEditing}
                />
              </View>
              {errors.reference && <Text style={styles.errorText}>{errors.reference}</Text>}
            </View>

            {/* Civilité */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Civilité *</Text>
              <View style={[styles.inputWrapper, errors.civilite && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                <Picker
                  selectedValue={formData.civilite}
                  style={styles.picker}
                  onValueChange={(value) => updateFormData('civilite', value)}
                >
                  <Picker.Item label="Sélectionner une civilité" value="" />
                  {civiliteOptions.map((civilite) => (
                    <Picker.Item key={civilite} label={civilite} value={civilite} />
                  ))}
                </Picker>
              </View>
              {errors.civilite && <Text style={styles.errorText}>{errors.civilite}</Text>}
            </View>

            {/* Nom et Prénom */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Nom *</Text>
                <View style={[styles.inputWrapper, errors.nom && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.input}
                    value={formData.nom}
                    onChangeText={(value) => updateFormData('nom', value)}
                    placeholder="Nom"
                    autoCapitalize="words"
                  />
                </View>
                {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Prénom *</Text>
                <View style={[styles.inputWrapper, errors.prenom && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.input}
                    value={formData.prenom}
                    onChangeText={(value) => updateFormData('prenom', value)}
                    placeholder="Prénom"
                    autoCapitalize="words"
                  />
                </View>
                {errors.prenom && <Text style={styles.errorText}>{errors.prenom}</Text>}
              </View>
            </View>

            {/* Contact */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contact *</Text>
              <View style={[styles.inputWrapper, errors.contact && styles.inputError]}>
                <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={formData.contact}
                  onChangeText={(value) => updateFormData('contact', value)}
                  placeholder="Numéro de téléphone"
                  keyboardType="phone-pad"
                />
              </View>
              {errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}
            </View>

            {/* Liste de Diffusion */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Liste de Diffusion *</Text>
              <View style={[styles.inputWrapper, errors.listeReference && styles.inputError]}>
                <Ionicons name="list-outline" size={20} color={COLORS.textSecondary} />
                <Picker
                  selectedValue={formData.listeReference}
                  style={styles.picker}
                  onValueChange={(value) => updateFormData('listeReference', value)}
                >
                  <Picker.Item label="Sélectionner une liste" value="" />
                  {listeDiffusion.map((liste) => (
                    <Picker.Item
                      key={liste.lst_reference}
                      label={liste.lst_libelle}
                      value={liste.lst_reference}
                    />
                  ))}
                </Picker>
              </View>
              {errors.listeReference && <Text style={styles.errorText}>{errors.listeReference}</Text>}
            </View>

            {/* Statut */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Statut *</Text>
              <View style={[styles.inputWrapper, errors.statut && styles.inputError]}>
                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textSecondary} />
                <Picker
                  selectedValue={formData.statut}
                  style={styles.picker}
                  onValueChange={(value) => updateFormData('statut', value)}
                >
                  {statutOptions.map((statut) => (
                    <Picker.Item key={statut} label={statut} value={statut} />
                  ))}
                </Picker>
              </View>
              {errors.statut && <Text style={styles.errorText}>{errors.statut}</Text>}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.surface} size="small" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color={COLORS.surface} />
                  <Text style={styles.saveButtonText}>
                    {isEditing ? 'Modifier' : 'Enregistrer'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.text,
    paddingVertical: SPACING.xs,
  },
  disabledInput: {
    color: COLORS.textSecondary,
  },
  picker: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    marginLeft: SPACING.sm,
  },
});

export default ProspectFormScreen;