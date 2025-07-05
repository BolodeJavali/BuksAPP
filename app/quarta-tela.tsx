import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function QuartaTela() {
  const router = useRouter();
  const [usuario, setusuario] = useState('');

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
      <View style={[styles.image, { backgroundColor: '#243A69', borderRadius: 60 }]} />
    )}

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Usuário</Text>
      <TextInput onChangeText={setusuario} style={styles.input} />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Senha</Text>
      <TextInput style={styles.input} secureTextEntry />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Confirme sua senha</Text>
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
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#243A69',
    gap: 25,
    paddingHorizontal: 20,
    //width: 426,
    //alignSelf: 'center' 
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
    marginTop: 20,
  },
  image1: {
    width: 30,
    height: 30,
  },
  mode: {
    backgroundColor: "#D4CDC5",
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: -25,
    marginRight:45
  }
});
