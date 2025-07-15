import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/segunda-tela');
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress}>
        <Image
          source={require('../assets/images/logoBuks.png')}
          style={styles.image}
          contentFit="cover"
        />
      </Pressable>
      <Pressable
        style={styles.cadastroButton}
        onPress={() => router.push('/CadastroScreen')}
      >
        <Text style={styles.cadastroText}>Cadastre-se</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#243A69',
  },
  image: {
    width: 400,
    height: 400,
  },
  cadastroButton: {
    marginTop: 32,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  cadastroText: {
    color: '#243A69',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});