import { Slot } from 'expo-router';
import { UserProvider } from '../context/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Slot /> {/* Isso é o que renderiza as rotas dentro do contexto */}
    </UserProvider>
  );
}
