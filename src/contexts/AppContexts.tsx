import React, { createContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedLang } from '../i18n';

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
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
}

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

// Crear contextos
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  lang: 'en' as SupportedLang,
  setLang: () => {},
});

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

// Provider para UserContext
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<SupportedLang>('en');

  const handleSetLang = (newLang: SupportedLang) => {
    setLang(newLang);
    AsyncStorage.setItem('language', newLang);
  };

  // Cargar idioma almacenado al inicializar
  React.useEffect(() => {
    const loadStoredLang = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('language');
        if (storedLang) {
          setLang(storedLang as SupportedLang);
        }
      } catch (error) {
        console.log('Error loading stored language:', error);
      }
    };
    loadStoredLang();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, lang, setLang: handleSetLang }}>
      {children}
    </UserContext.Provider>
  );
};

// Provider para ThemeContext
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<string>('dark');

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  // Cargar tema almacenado al inicializar
  React.useEffect(() => {
    const loadStoredTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          setTheme(storedTheme);
        }
      } catch (error) {
        console.log('Error loading stored theme:', error);
      }
    };
    loadStoredTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
