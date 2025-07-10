import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useUser } from '../context/UserContext';


const categorias = [
  'Ação', 'Aventura', 'Biografia', 'Clássico', 'Comédia', 'Conto',
];

export default function TerceiraTela() {
  const { usuario, avatarUrl } = useUser(); 
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [livrosPorCategoria, setLivrosPorCategoria] = useState({});

  const imageUrl = 'https://api.dicebear.com/9.x/initials/png?seed=' + (usuario || 'Anon') + '&padding=20';

  const buscarLivros = async (termo: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(termo)}`
      );
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      return [];
    }
  };

  useEffect(() => {
    const carregarCategorias = async () => {
      const resultados = {};
      for (const categoria of categorias) {
        const livros = await buscarLivros(categoria);
        resultados[categoria] = livros;
      }
      setLivrosPorCategoria(resultados);
    };

    carregarCategorias();
  }, []);

  useEffect(() => {
    const buscar = async () => {
      if (query.trim() === '') {
        setResultadosBusca([]);
        return;
      }

      const livros = await buscarLivros(query);
      setResultadosBusca(livros);
    };

    buscar();
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.setusuario}>
        <View style={styles.usuarioInfo}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
      <Text style={styles.texto}>Bem-vindo, {usuario}!</Text>
      
    </View>


        <View style={styles.mode}>
          <Pressable onPress={() => router.push('/terceira_tela')}>
            <Image
              source={require('../assets/images/sun.png')}
              style={styles.image1}
              contentFit="cover"
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar livros"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView style={styles.scroll}>
  {query.trim() !== '' && resultadosBusca.length > 0 && (
    <View style={styles.categoria}>
      <Text style={styles.categoriaTitulo}>Resultados da busca</Text>
      <FlatList
        data={resultadosBusca}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const volume = item.volumeInfo;
          return volume.imageLinks?.thumbnail ? (
            <Image
              source={{ uri: volume.imageLinks.thumbnail }}
              style={styles.livroCapa}
            />
          ) : null;
        }}
      />
    </View>
  )}

  {categorias.map((categoria) => (
    <View key={categoria} style={styles.categoria}>
      <Text style={styles.categoriaTitulo}>{categoria}</Text>
      <FlatList
        data={livrosPorCategoria[categoria] || []}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const volume = item.volumeInfo;
          return volume.imageLinks?.thumbnail ? (
            <Image
              source={{ uri: volume.imageLinks.thumbnail }}
              style={styles.livroCapa}
            />
          ) : null;
        }}
      />
    </View>
  ))}
</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191013',
  },
  setusuario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
    marginVertical: 25,
  },
  usuarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  mode: {
    backgroundColor: '#D4CDC5',
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image1: {
    width: 30,
    height: 30,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  categoria: {
    marginBottom: 20,
  },
  categoriaTitulo: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  livroCapa: {
    width: 100,
    height: 150,
    marginRight: 10,
    borderRadius: 6,
  },
  texto: {
    color: '#D4CDC5'
  }
});