import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useUser } from '../context/UserContext'; // ajuste o caminho se necessário


const discovery = {
  authorizationEndpoint: 'https://suap.ifrn.edu.br/o/authorize/',
  tokenEndpoint: 'https://suap.ifrn.edu.br/o/token/',
};

const clientId = 'OZfovu2QZw2qw1jt4NgyQ6JHcMxmHufzQklMYY1B';

export default function HomeScreen() {
  const router = useRouter();
  const { setUsuario } = useUser(); // <-- novo
  const hasProcessedRef = useRef(false);

  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: ['identificacao', 'email'],
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  useEffect(() => {
    const fetchTokenAndUser = async (code) => {
      try {
        // Obter o token
        const tokenResponse = await fetch(discovery.tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
            redirectUri
          )}&client_id=${clientId}`,
        });

        const tokenResult = await tokenResponse.json();

        if (tokenResult.access_token) {
          const token = tokenResult.access_token;
          console.log('✅ Token obtido:', token);

          // Obter dados do usuário do SUAP
          const userResponse = await fetch('https://suap.ifrn.edu.br/api/v2/minhas-informacoes/meus-dados/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = await userResponse.json();
          console.log('👤 Dados do usuário:', userData);

          // Salvar no contexto
          setUsuario(userData.nome_usual || userData.nome); // <-- ajusta conforme os dados retornados

          // Navega para a próxima tela
          router.push('/terceira_tela');
        } else {
          Alert.alert('Erro ao obter token', JSON.stringify(tokenResult));
        }
      } catch (error) {
        Alert.alert('Erro na autenticação', error.message);
      }
    };

    if (response?.type === 'success' && !hasProcessedRef.current) {
      hasProcessedRef.current = true;
      const code = response.params.code;
      fetchTokenAndUser(code);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => promptAsync()} disabled={!request}>
        <Image
          source={require('../assets/images/logoBuks.png')}
          style={styles.image}
          contentFit="cover"
        />
      </Pressable>
    </View>
  );
}

import { StyleSheet } from 'react-native';

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
});
