import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Détail du document</Text>
      <Text style={{ marginTop: 8, color: '#666' }}>ID: {id}</Text>
      <View style={{ height: 16 }} />
      <View style={{ padding: 16, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ fontWeight: '600' }}>Métadonnées</Text>
        <Text style={{ marginTop: 6 }}>Type: —</Text>
        <Text>Date d'émission: —</Text>
        <Text>Statut: —</Text>
      </View>
    </View>
  );
}