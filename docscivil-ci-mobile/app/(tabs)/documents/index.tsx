import { View, Text, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const documents = [
  { id: '1', title: 'Attestation de résidence', status: 'Validé' },
  { id: '2', title: 'Extrait de naissance', status: 'En cours' },
  { id: '3', title: 'Casier judiciaire', status: 'Expiré' },
];

export default function DocumentsScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Documents</Text>
        <Link href="/(tabs)/documents/new" asChild>
          <Pressable style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Ionicons name="add-circle" size={22} color="#1f6feb" />
            <Text style={{ color: '#1f6feb', fontWeight: '600' }}>Nouveau</Text>
          </Pressable>
        </Link>
      </View>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <Link href={`/(tabs)/documents/${item.id}`} asChild>
            <Pressable style={{ padding: 16, borderWidth: 1, borderRadius: 12, backgroundColor: 'white' }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
              <Text style={{ marginTop: 4, color: '#666' }}>{item.status}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}