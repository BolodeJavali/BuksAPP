import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
import { useUser } from '../context/UserContext';

// Interface para tipagem dos livros
interface Livro {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

const categorias = [
  'Ação', 'Aventura', 'Biografia', 'Clássico', 'Comédia', 'Conto',
];

export default function TerceiraTelaE() {
  const { usuario, avatarUrl } = useUser(); 
  const router = useRouter();
  
  // Log para debugging
  console.log("Dados do usuário na terceira-tela-e:", usuario);

  const [query, setQuery] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<Livro[]>([]);
  const [livrosPorCategoria, setLivrosPorCategoria] = useState<Record<string, Livro[]>>({});
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);
      try {
        const resultados: Record<string, Livro[]> = {};
        // Carrega apenas 3 categorias inicialmente para melhor performance
        const categoriasIniciais = categorias.slice(0, 3);
        for (const categoria of categoriasIniciais) {
          const livros = await buscarLivros(categoria);
          resultados[categoria] = livros;
        }
        setLivrosPorCategoria(resultados);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        Alert.alert('Erro', 'Não foi possível carregar as categorias de livros.');
      } finally {
        setIsLoading(false);
      }
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

    // Adiciona um pequeno delay para não fazer muitas requisições enquanto digita
    const timeoutId = setTimeout(buscar, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const navegarParaDetalhes = (id: string) => {
    try {
      router.push({ pathname: '/detalhes/[id]', params: { id } });
    } catch (error) {
      console.error('Erro na navegação:', error);
      Alert.alert('Erro', 'Não foi possível abrir os detalhes deste livro.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.setusuario}>
        <View style={styles.usuarioInfo}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, { backgroundColor: '#333' }]} />
          )}
          <Text style={styles.texto}>Bem-vindo, {usuario?.nome || 'visitante'}!</Text>
        </View>

        <View style={styles.mode}>
          <Pressable 
            onPress={() => router.push('/terceira-tela')}
            accessible={true}
            accessibilityLabel="Alternar para modo claro"
          >
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

      {/* Indicador de carregamento */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4CDC5" />
          <Text style={styles.loadingText}>Carregando livros...</Text>
        </View>
      )}

      {/* Mensagem de busca sem resultados */}
      {!isLoading && query.trim() !== '' && resultadosBusca.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Nenhum resultado encontrado para "{query}"
          </Text>
        </View>
      )}

      <FlatList
        data={[
          ...(query.trim() !== '' && resultadosBusca.length > 0 
            ? [{ id: 'resultados', titulo: 'Resultados da busca', dados: resultadosBusca }] 
            : []),
          ...categorias.map(categoria => ({ 
            id: categoria, 
            titulo: categoria, 
            dados: livrosPorCategoria[categoria] || [] 
          }))
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.categoria}>
            <Text style={styles.categoriaTitulo}>{item.titulo}</Text>
            <FlatList
              data={item.dados}
              keyExtractor={(livro, index) => livro?.id || `livro-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: livro }) => {
                const volume = livro?.volumeInfo;
                return volume?.imageLinks?.thumbnail ? (
                  <Pressable 
                    onPress={() => navegarParaDetalhes(livro.id)}
                    accessible={true}
                    accessibilityLabel={`Livro: ${volume.title || 'Sem título'}`}
                    accessibilityHint="Toque para ver detalhes do livro"
                  >
                    <Image
                      source={{ uri: volume.imageLinks.thumbnail }}
                      style={styles.livroCapa}
                      contentFit="cover"
                    />
                  </Pressable>
                ) : null;
              }}
              ListEmptyComponent={
                !isLoading && (
                  <Text style={styles.emptyListText}>Nenhum livro encontrado</Text>
                )
              }
            />
          </View>
        )}
      />
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
  },
  avatar: {
    width: 80,
    height: 80,
    marginRight: 12, // Adicionado para substituir o gap
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
  categoria: {
    marginBottom: 20,
    paddingHorizontal: 16,
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
    color: '#D4CDC5',
    fontSize: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#D4CDC5',
    marginTop: 10,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#D4CDC5',
    textAlign: 'center',
  },
  emptyListText: {
    color: '#D4CDC5',
    fontStyle: 'italic',
    padding: 10,
  }
});