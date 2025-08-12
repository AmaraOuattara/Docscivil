import { View, Text, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function SignInScreen() {
  return (
    <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Connexion</Text>
      <TextInput placeholder="Email" style={{ borderWidth: 1, borderRadius: 8, padding: 12 }} />
      <TextInput placeholder="Mot de passe" secureTextEntry style={{ borderWidth: 1, borderRadius: 8, padding: 12 }} />
      <Pressable style={{ backgroundColor: '#1f6feb', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Se connecter</Text>
      </Pressable>
      <Link href="/(tabs)/home" asChild>
        <Pressable style={{ padding: 14 }}>
          <Text style={{ textAlign: 'center' }}>Continuer sans compte</Text>
        </Pressable>
      </Link>
    </View>
  );
}