import React, { createContext } from 'react';

// Tipos para los contextos
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  user_uuid?: string;
  [key: string]: any;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  lang: string;
  setLang: (lang: string) => void;
}

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

// Crear contextos
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  lang: 'en',
  setLang: () => {},
});

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});
