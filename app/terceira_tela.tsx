import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useUser } from '../context/UserContext';

const categorias = [
  'Ação', 'Aventura', 'Biografia', 'Clássico', 'Comédia', 'Conto',
  'Crime', 'Crônica', 'Drama', 'Erótico', 'Fantasia',
];

export default function TerceiraTela() {
  const { usuario, avatarUrl } = useUser();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);
  const [livrosPorCategoria, setLivrosPorCategoria] =
    useState<Record<string, any[]>>({});

  /* ------------------ helpers ------------------ */
  const buscarLivros = async (termo: string) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          termo
        )}`
      );
      const data = await res.json();
      return data.items || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  /* carrega listas por categoria */
  useEffect(() => {
    (async () => {
      const res: Record<string, any[]> = {};
      for (const cat of categorias) res[cat] = await buscarLivros(cat);
      setLivrosPorCategoria(res);
    })();
  }, []);

  /* busca pelo texto digitado */
  useEffect(() => {
    if (!query.trim()) return setResultadosBusca([]);
    (async () => setResultadosBusca(await buscarLivros(query)))();
  }, [query]);

  /* ------------------ ui ------------------ */
  return (
    <View style={styles.container}>
      {/* cabeçalho simples */}
      <View style={styles.setusuario}>
        <View style={styles.usuarioInfo}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text style={styles.texto}>
            Bem‑vindo, {usuario || 'visitante'}!
          </Text>
        </View>
      </View>

      {/* campo de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar livros"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* listas horizontais */}
      <FlatList
        data={[{ titulo: 'Resultados', dados: resultadosBusca }, ...categorias.map(c => ({ titulo: c, dados: livrosPorCategoria[c] || [] }))]}
        keyExtractor={(item) => item.titulo}
        renderItem={({ item }) =>
          item.titulo === 'Resultados' && query.trim() === ''
            ? null
            : (
              <ListaHorizontal
                titulo={item.titulo === 'Resultados' ? 'Resultados da busca' : item.titulo}
                dados={item.dados}
                onPressItem={(id) =>
                  router.push({ pathname: '/detalhes/[id]', params: { id } })
                }
              />
            )
        }
      />
    </View>
  );
}

/* ---------- componente auxiliar ---------- */
function ListaHorizontal({
  titulo,
  dados,
  onPressItem,
}: {
  titulo: string;
  dados: any[];
  onPressItem: (id: string) => void;
}) {
  if (!dados.length) return null;

  return (
    <View style={styles.categoria}>
      <Text style={styles.categoriaTitulo}>{titulo}</Text>
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialNumToRender={6}
        renderItem={({ item }) =>
          item.volumeInfo.imageLinks?.thumbnail ? (
            <Pressable onPress={() => onPressItem(item.id)}>
              <Image
                source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                style={styles.livroCapa}
              />
            </Pressable>
          ) : null
        }
      />
    </View>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#243A69' },

  /* cabeçalho */
  setusuario: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  usuarioInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  texto: { color: '#D4CDC5', fontSize: 16 },

  /* busca */
  searchContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  /* listas */
  categoria: { marginBottom: 24, paddingLeft: 16 },
  categoriaTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  livroCapa: { width: 100, height: 150, marginRight: 10, borderRadius: 6 },
});
