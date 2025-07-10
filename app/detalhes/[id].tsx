import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function DetalhesLivro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [livro, setLivro] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // busca detalhes
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        setLivro(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!livro) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Livro não encontrado.</Text>
      </View>
    );
  }

  const info = livro.volumeInfo;
  return (
    <ScrollView
      contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
      <Pressable style={styles.voltar} onPress={() => router.back()}>
        <Text style={styles.voltarTxt}>‹ Voltar</Text>
      </Pressable>

      {info.imageLinks?.thumbnail && (
        <Image source={{ uri: info.imageLinks.thumbnail }} style={styles.capa} />
      )}

      <Text style={styles.titulo}>{info.title}</Text>
      {info.subtitle && <Text style={styles.subtitulo}>{info.subtitle}</Text>}

      <View style={styles.card}>
        <Text style={styles.cardTxt}>
          <Text style={styles.bold}>Autor: </Text>
          {info.authors?.join(', ') || '—'}
          {'\n'}
          <Text style={styles.bold}>Publicado: </Text>
          {info.publishedDate || '—'}
          {'\n'}
          <Text style={styles.bold}>Categorias: </Text>
          {info.categories?.join(', ') || '—'}
          {'\n\n'}
          <Text style={styles.bold}>Sinopse:{'\n'}</Text>
          {info.description
            ? info.description.replace(/<[^>]+>/g, '')
            : 'Sem descrição disponível.'}
        </Text>
      </View>
    </ScrollView>
  );               // ← fecha o return
}                  // ← fecha a função DetalhesLivro

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#243A69',
    padding: 24,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    backgroundColor: '#243A69',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voltar: { alignSelf: 'flex-start', marginBottom: 16 },
  voltarTxt: { color: '#D4CDC5', fontSize: 16 },
  capa: { width: 130, height: 190, borderRadius: 8, marginBottom: 24 },
  titulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    color: '#D4CDC5',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#D4CDC5',
    borderRadius: 12,
    padding: 16,
  },
  cardTxt: { color: '#243A69', fontSize: 14, lineHeight: 20 },
  bold: { fontWeight: 'bold' },
});
