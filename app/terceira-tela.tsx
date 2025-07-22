import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../app/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Usuario {
  nome?: string;
  email?: string;
  uid?: string;
}

interface UserContextType {
  usuario: Usuario | null;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
  avatarUrl: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  
  // Escutar mudanças de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário logado
        setUsuario((prevUsuario) => ({
          ...prevUsuario,
          email: user.email || '',
          uid: user.uid
        }));
      } else {
        // Usuário deslogado
        setUsuario(null);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  const avatarUrl = usuario?.nome 
    ? `https://api.dicebear.com/9.x/initials/png?seed=${usuario.nome}&padding=20`
    : '';
  
  return (
    <UserContext.Provider value={{ usuario, setUsuario, avatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};
