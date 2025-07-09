import * as AuthSession from 'expo-auth-session';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useUser } from '../context/UserContext';

console.log(AuthSession.makeRedirectUri({ useProxy: true }));

export default function SegundaTela() {
  const router = useRouter();
  const { usuario, setUsuario } = useUser(); // ← pegando o nome do contexto

  const imageUrl = 'https://api.dicebear.com/9.x/initials/png?seed=' + usuario + '&padding=20';

  return (
    <View style={styles.container}>
      <View style={styles.mode}>
        <Pressable onPress={() => router.push('/primeira-tela-e')}>
          <Image
            source={require('../assets/images/moon.png')}
            style={styles.image1}
            contentFit="cover"
          />
        </Pressable>
      </View>

      {usuario ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.image, { backgroundColor: '#243A69' }]} />
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUsuario} // ← salvando no contexto
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} secureTextEntry />
      </View>

      <View style={styles.enter}>
        <Pressable onPress={() => router.push('/terceira_tela')}>
          <Image
            source={require('../assets/images/arrow.png')}
            style={styles.image1}
            contentFit="cover"
          />
        </Pressable>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Não tem conta?</Text>
        <Pressable onPress={() => router.push('/quarta-tela')}>
          <Text style={styles.textoBotao}>Clique aqui</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ... resto do código da sua SegundaTela

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#243A69',
    gap: 25,
    paddingHorizontal: 20,
  },
  image: {
    width: 120,
    height: 120,
  },
  inputGroup: {
    width: '100%',
    maxWidth: 300,
    gap: 5,
  },
  label: {
    color: '#D4CDC5',
    fontSize: 12,
    paddingLeft: 10,
  },
  input: {
    backgroundColor: '#D4CDC5',
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 40,
    color: '#243A69',
  },
  enter: {
    backgroundColor: '#D4CDC5',
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: -15,
  },
  image1: {
    width: 30,
    height: 30,
  },
  group: {
    alignItems: 'center',
    gap: 5,
    marginTop: 15,
  },
  textoBotao: {
    textDecorationLine: 'underline',
    fontSize: 12,
    color: '#D4CDC5',
  },
  mode: {
    backgroundColor: '#D4CDC5',
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: -25,
    marginRight: 45,
  },
});
