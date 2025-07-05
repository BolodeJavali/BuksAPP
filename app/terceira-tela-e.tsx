import { StyleSheet, Text, View } from 'react-native';

export default function TerceiraTela() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Você chegou na Terceira Tela! 🎉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191013',
    justifyContent: 'center',
    alignItems: 'center',
    //width: 426,
    //alignSelf: 'center' 
  },
  texto: {
    color: '#D4CDC5',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
