import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ConfigScreen from './screens/ConfigScreen';

import { translations, t, SupportedLang } from './i18n';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRef } from 'react';


const Stack = createStackNavigator();



export const UserContext = React.createContext<{user: any, setUser: (u: any) => void, lang: SupportedLang, setLang: (l: SupportedLang) => void}>({user: null, setUser: () => {}, lang: 'en', setLang: () => {}});


function App() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [lang, setLang] = React.useState<SupportedLang>('en');



  // Checa expiración de sesión (ejemplo: user.expiry debe ser timestamp futuro)
  // Refresca el token si está por expirar (menos de 5 minutos)
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);

  // Función para refrescar el token (comentada hasta tener endpoint real)
  /*
  const refreshToken = async (oldToken: string) => {
    try {
      // Suponiendo que tienes un método refresh en loginService
      const { token: newToken } = await require('./services/loginService').refreshToken(oldToken);
      if (newToken) {
        const payload = JSON.parse(atob(newToken.split('.')[1]));
        const expiry = payload.exp ? payload.exp * 1000 : null;
        const session = await AsyncStorage.getItem('@userSession');
        if (session) {
          const userData = JSON.parse(session);
          const updated = { ...userData, token: newToken, expiry };
          await AsyncStorage.setItem('@userSession', JSON.stringify(updated));
          setUser(updated);
    } catch {
      // Si falla el refresh, elimina la sesión y manda al login
      await AsyncStorage.removeItem('@userSession');
      setUser(null);
    }
  };
  */

  React.useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem('@userSession').then(session => {
      if (!isMounted) return;
      if (session) {
        try {
          const userData = JSON.parse(session);
          if (userData.expiry && Date.now() > Number(userData.expiry)) {
            AsyncStorage.removeItem('@userSession');
            setUser(null);
          } else {
            setUser(userData);
            // Si el token expira en menos de 5 minutos, refresca
            // if (userData.token && userData.expiry && userData.expiry - Date.now() < 5 * 60 * 1000) {
            //   refreshToken(userData.token);
            // }
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  // Intervalo para refrescar token si el usuario está en la app
  React.useEffect(() => {
    if (!user || !user.token || !user.expiry) return;
    if (refreshTimeout.current) clearInterval(refreshTimeout.current);
    refreshTimeout.current = setInterval(() => {
      // if (user.expiry - Date.now() < 5 * 60 * 1000 && user.expiry - Date.now() > 0) {
      //   refreshToken(user.token);
      // }
      if (user.expiry && Date.now() > Number(user.expiry)) {
        AsyncStorage.removeItem('@userSession');
        setUser(null);
      }
    }, 60 * 1000); // revisa cada minuto
    return () => {
      if (refreshTimeout.current) clearInterval(refreshTimeout.current);
    };
  }, [user]);

  if (loading) return null;

  return (
    <UserContext.Provider value={{ user, setUser, lang, setLang }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={user ? 'Home' : 'Login'}
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: require('./theme/colors').colors.background,
              borderBottomWidth: 0,
              elevation: 0,
            },
            headerTitleStyle: {
              color: require('./theme/colors').colors.text,
              fontWeight: 'bold',
              fontSize: 20,
            },
            headerTintColor: require('./theme/colors').colors.text,
          }}
        >
          {user ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: t(lang, 'home', 'welcome') }} />
              <Stack.Screen name="Config" component={ConfigScreen} options={{ title: t(lang, 'config', 'title') }} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} options={{ title: t(lang, 'login', 'title') }} />
              <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: t(lang, 'signup', 'title') }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

export default App;
