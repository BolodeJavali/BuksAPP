import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, ActivityIndicator, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useUser } from '../context/UserContext';

export type Usuario = {
  nome: string;
  email: string;
  uid: string;
  // ... (outras propriedades)
};

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [cadastroSucesso, setCadastroSucesso] = useState(false);
  const router = useRouter();
  const { setUsuario } = useUser();

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

    try {
      console.log('Tentando cadastrar usuário:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      console.log('Cadastro bem-sucedido!');
      
      setUsuario({
        nome: nome,
        email: email,
        uid: userCredential.user.uid
      });
      
      setNome('');
      setEmail('');
      setSenha('');
      
      setCadastroSucesso(true);
      
      Alert.alert(
        'Cadastro realizado!', 
        `Bem-vindo, ${nome}! Clique em "Ir para Login" para entrar no aplicativo.`
      );
      
    } catch (error: any) {
      console.error('Erro completo no cadastro:', error);
      
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

  const renderConteudo = () => {
    if (cadastroSucesso) {
      return (
        <>
          <View style={styles.sucessoBox}>
            <Text style={styles.sucessoText}>Cadastro realizado com sucesso!</Text>
            <Text style={styles.sucessoSubtext}>Use o botão abaixo para fazer login</Text>
          </View>
          
          <Pressable 
            style={styles.sucessoButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.sucessoButtonText}>Ir para Login</Text>
          </Pressable>
        </>
      );
    } else {
      return (
        <>
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
            <Pressable 
              style={styles.loginButtonLarge} 
              onPress={handleCadastro}
            >
              <Text style={styles.buttonText}>Cadastrar</Text>
            </Pressable>
          )}
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      
      {renderConteudo()}
      
      <Link href="/login" asChild>
        <Pressable style={styles.testButton}>
          <Text style={styles.testButtonText}>
            {cadastroSucesso ? 'Ir para Login' : 'Voltar para Login'}
          </Text>
        </Pressable>
      </Link>
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
  loginButtonLarge: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#243A69',
    fontWeight: 'bold',
    fontSize: 16,
  },
  testButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  sucessoBox: {
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  sucessoText: {
    color: '#27ae60',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sucessoSubtext: {
    color: '#fff',
    textAlign: 'center',
  },
  sucessoButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  sucessoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});