import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

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
    //width: 426,
    //alignSelf: 'center' 
  },
  image: {
    width: 400,
    height: 400,
  },
});