import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import api from '@/services/Api';

export default function QuartaTela() {
  const router = useRouter();
  const [usuario, setusuario] = useState('')
  
  const imageUrl = 'https://api.dicebear.com/9.x/initials/svg?seed='+usuario



   

  //const imageUrl = usuario ? api.get(`${usuario}`) : null
  return (   
    <View style={styles.container}>
      {imageUrl ? (
        <Image
        source={{ uri: imageUrl}}
        style={styles.image}
        contentFit="cover"
      />
      ) : (
        <Image
        source={require('../assets/images/Frame.png')}
        style={styles.image}
        contentFit="cover"
      />
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Usuário</Text>
        <TextInput onChangeText={setusuario} style={styles.input}/>
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
        <Pressable onPress={()=> router.push('/terceira_tela')}>
          <Image
            source={require('../assets/images/logoBuks.png')}
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
});
