import React, { createContext, useContext, useState } from 'react';

interface Usuario {
  nome?: string;
}

interface UserContextType {
  usuario: Usuario | null;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
  avatarUrl: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  
  
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
