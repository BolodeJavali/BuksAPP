import { View, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Api from '../services/Api'

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
