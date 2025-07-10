import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState('');
  const avatarUrl = `https://api.dicebear.com/9.x/initials/png?seed=${usuario}&padding=20`;

  return (
    <UserContext.Provider value={{ usuario, setUsuario, avatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
