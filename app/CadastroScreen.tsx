import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validarCampos = () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Erro', 'Digite um e-mail válido.');
      return false;
    }
    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const handleCadastro = async () => {
    if (!validarCampos()) return;

    setLoading(true); 

    // Integração com API
    try {
      console.log('Tentando cadastrar usuário:', email); // Log para depuração
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      console.log('Cadastro bem-sucedido:', userCredential.user.uid);
      Alert.alert('Cadastro realizado!', `Bem-vindo, ${nome}!`);
      setNome('');
      setEmail('');
      setSenha('');
      router.push({ pathname: '/login', params: { sucesso: '1' } });
    } catch (error: any) { 
      console.error('Erro no cadastro:', error); 
      
      let mensagem = 'Não foi possível cadastrar. Tente novamente.';
      
      if (error?.code === 'auth/email-already-in-use') {
        mensagem = 'Este e-mail já está cadastrado. Tente fazer login.';
      } else if (error?.code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (error?.code === 'auth/weak-password') {
        mensagem = 'Senha muito fraca. Use pelo menos 6 caracteres.';
      } else if (error?.code === 'auth/network-request-failed') {
        mensagem = 'Erro de conexão. Verifique sua internet.';
      }
      
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{marginTop: 20}} />
      ) : (
        <Button title="Cadastrar" onPress={handleCadastro} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#243A69',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});