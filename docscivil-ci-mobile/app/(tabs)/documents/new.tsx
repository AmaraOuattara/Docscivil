import { View, Text, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';

export default function NewDocumentScreen() {
  const [result, setResult] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  const pick = async () => {
    const res = await DocumentPicker.getDocumentAsync({ multiple: false });
    setResult(res);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Nouveau document</Text>
      <Pressable onPress={pick} style={{ backgroundColor: '#1f6feb', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Choisir un fichier</Text>
      </Pressable>
      {result && 'assets' in result && result.assets?.[0] && (
        <View style={{ padding: 16, borderWidth: 1, borderRadius: 12 }}>
          <Text style={{ fontWeight: '600' }}>Fichier sélectionné</Text>
          <Text style={{ marginTop: 6 }}>{result.assets[0].name}</Text>
          <Text>{result.assets[0].mimeType}</Text>
        </View>
      )}
    </View>
  );
}