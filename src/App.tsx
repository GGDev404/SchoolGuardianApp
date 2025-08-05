import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { colorPalettes } from './theme/colors';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserContext, ThemeContext } from './contexts/AppContexts';

import HomeScreen from './screens/HomeScreen';
import ClassDetailScreen from './screens/ClassDetailScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ConfigScreen from './screens/ConfigScreen';
import CalendarScreen from './screens/CalendarScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import EditProfileScreen from './screens/EditProfileScreen';

import { translations, SupportedLang } from './i18n';
import { getTranslation } from './hooks/useTranslation';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRef, useContext } from 'react';

const Stack = createStackNavigator();

function App() {
  // Usar contextos en lugar de estado local
  const { user, setUser, lang, setLang } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  
  const [loading, setLoading] = React.useState(true);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);

  const safeTheme = theme === 'light' ? 'light' : 'dark';
  const colors = colorPalettes[safeTheme];

  React.useEffect(() => {
    changeNavigationBarColor(colors.background, safeTheme === 'dark');
  }, [colors.background, safeTheme]);

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
  }, [setUser]);

  // Intervalo para refrescar token si el usuario está en la app
  React.useEffect(() => {
    if (!user || !user.token || !user.expiry) return;
    if (refreshTimeout.current) clearInterval(refreshTimeout.current);
    refreshTimeout.current = setInterval(() => {
      if (user.expiry && Date.now() > Number(user.expiry)) {
        AsyncStorage.removeItem('@userSession');
        setUser(null);
      }
    }, 60 * 1000); // revisa cada minuto
    return () => {
      if (refreshTimeout.current) clearInterval(refreshTimeout.current);
    };
  }, [user, setUser]);

  if (loading) return null;

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={user ? 'Home' : 'Login'}
          screenOptions={{ headerShown: false }}
        >
          {user ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: getTranslation(lang, 'home', 'todaysClasses') }} />
              <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: getTranslation(lang, 'calendar', 'title') }} />
              <Stack.Screen name="Config" component={ConfigScreen} options={{ title: getTranslation(lang, 'config', 'title') }} />
              <Stack.Screen name="ClassDetail" component={ClassDetailScreen} options={{ title: getTranslation(lang, 'home', 'todaysClasses') }} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificaciones' }} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} options={{ title: getTranslation(lang, 'login', 'title') }} />
              <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: getTranslation(lang, 'signup', 'title') }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
