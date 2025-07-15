import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const params = useLocalSearchParams();
  const router = useRouter();
  const emailInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (params?.sucesso === '1') {
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [params?.sucesso]);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      Alert.alert('Sucesso', 'Login realizado com sucesso!', [
        { text: 'OK', onPress: () => router.push('/') }
      ]);
    } catch (error: any) {
      console.error('Erro completo de login:', error);
      
      let mensagem = 'Não foi possível fazer login. Verifique suas credenciais.';
      
      if (error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password') {
        mensagem = 'E-mail ou senha incorretos.';
      } else if (error?.code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (error?.code === 'auth/too-many-requests') {
        mensagem = 'Muitas tentativas de login. Tente novamente mais tarde.';
      }
      
      Alert.alert('Erro', mensagem);
    }
  };

  return (
    <View style={styles.container}>
      {params?.sucesso === '1' && (
        <View style={styles.sucessoBox}>
          <Text style={styles.sucesso}>Cadastro feito com êxito!</Text>
          
          <Pressable
            style={styles.loginButton}
            onPress={() => {
              setEmail('');
              setSenha('');
              emailInputRef.current?.focus();
            }}
          >
            <Text style={styles.loginButtonText}>Fazer login</Text>
          </Pressable>
        </View>
      )}
      
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        ref={emailInputRef}
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
      
      <Pressable 
        style={styles.loginButtonLarge}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Entrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#243A69',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  sucessoBox: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,255,0,0.1)',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  sucesso: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginButtonLarge: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#243A69',
    fontWeight: 'bold',
    fontSize: 16,
  },
});