import { createContext, ReactNode, useContext, useState } from 'react';

type UserContextType = {
  usuario: string;
  setUsuario: (nome: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState('');
  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser precisa estar dentro do UserProvider');
  }
  return context;
}
