import { View, Text, StyleSheet } from 'react-native';

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
    backgroundColor: '#243A69',
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    color: '#D4CDC5',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
