import React, { useState } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View, StyleSheet, Alert } from 'react-native';
import { useUser } from '../context/UserContext';

interface Usuario {
  nome?: string;
}

export default function QuartaTelaEscura() {
  const router = useRouter();
  const { usuario, setUsuario, avatarUrl } = useUser();
  
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  
  const handleEntrar = () => {
    if (!usuario?.nome) {
      Alert.alert('Campo obrigatório', 'Preencha o campo de usuário');
      return;
    }
    
    if (!senha || !confirmaSenha) {
      Alert.alert('Campos obrigatórios', 'Preencha os campos de senha');
      return;
    }
    
    if (senha !== confirmaSenha) {
      Alert.alert('Senhas diferentes', 'As senhas não coincidem');
      return;
    }
    
    Alert.alert('Sucesso', 'Informações salvas com sucesso!', [
      { text: 'OK', onPress: () => router.push('/terceira-tela-e') }
    ]);
  };

  if (!setUsuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Erro ao carregar o contexto do usuário</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mode}>
        <Pressable onPress={() => router.push('/quarta-tela')}>
          <Image
            source={require('../assets/images/sun.png')}
            style={styles.image1}
            contentFit="cover"
          />
        </Pressable>
      </View>

      {usuario?.nome && avatarUrl ? (
        <Image 
          source={{ uri: avatarUrl }} 
          style={styles.image} 
          contentFit="cover"
        />
      ) : (
        <View style={[styles.image, { backgroundColor: '#243A69', borderRadius: 60 }]} />
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Usuário</Text>
        <TextInput 
          onChangeText={(nome) => setUsuario({ ...(usuario || {}), nome } as Usuario)}
          value={usuario?.nome || ''}
          style={styles.input}
          placeholder="Digite seu nome de usuário"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <TextInput 
          style={styles.input} 
          secureTextEntry 
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirme sua senha</Text>
        <TextInput 
          style={styles.input} 
          secureTextEntry
          value={confirmaSenha}
          onChangeText={setConfirmaSenha}
          placeholder="Digite novamente sua senha"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.enter}>
        <Pressable onPress={handleEntrar}>
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
    backgroundColor: '#191013',
    paddingHorizontal: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 25, 
  },
  inputGroup: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 25, 
  },
  label: {
    color: '#D4CDC5',
    fontSize: 12,
    paddingLeft: 10,
    marginBottom: 5, 
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
    marginRight: 45,
  },
});

