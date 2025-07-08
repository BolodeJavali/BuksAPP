import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

const discovery = {
  authorizationEndpoint: 'https://suap.ifrn.edu.br/o/authorize/',
  tokenEndpoint: 'https://suap.ifrn.edu.br/o/token/',
};

const clientId = 'OZfovu2QZw2qw1jt4NgyQ6JHcMxmHufzQklMYY1B';

export default function HomeScreen() {
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false);

  const redirectUri = makeRedirectUri({
    useProxy: true,
  });

  useEffect(() => {
    console.log("🔗 Redirect URI gerado:", redirectUri);
  }, []);

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
    const fetchToken = async () => {
      if (response?.type === 'success' && !hasNavigated) {
        const code = response.params.code;

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
          console.log('Token:', tokenResult.access_token);
          setHasNavigated(true);
          router.push('/terceira_tela');
        } else {
          Alert.alert('Erro ao obter token', JSON.stringify(tokenResult));
        }
      }
    };

    fetchToken();
  }, [response]);

  const handleLogin = () => {
    promptAsync();
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleLogin} disabled={!request}>
        <Image
          source={require('../assets/images/logoBuks.png')}
          style={styles.image}
          contentFit="cover"
        />
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
});
