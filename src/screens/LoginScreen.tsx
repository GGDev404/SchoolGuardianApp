import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { colors } from '../theme/colors';
import CustomButton from '../components/CustomButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  input: {
    backgroundColor: colors.input,
    color: colors.inputText,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 6,
  },
  button: {
    backgroundColor: colors.button,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 10,
  },
  buttonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  infoText: {
    color: colors.textSecondary,
    marginTop: 20,
    fontSize: 12,
  },
});


import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/loginService';

type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
  Login: undefined;
};

import { useContext } from 'react';
import { UserContext } from '../App';
import { t } from '../i18n';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setUser, lang } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceUUID, setDeviceUUID] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Recuperar el UUID del dispositivo si existe en AsyncStorage
    AsyncStorage.getItem('@deviceUUID').then(uuid => {
      if (uuid) setDeviceUUID(uuid);
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t(lang, 'errors', 'error'), t(lang, 'login', 'errorRequired'));
      return;
    }
    setLoading(true);
    try {
      const res = await login({ email, password, user_uuid: deviceUUID });
      // Guardar solo la propiedad 'user' si existe
      const userData = res.user || res;
      // Extraer token y expiración si existe
      let token = res.token || res.accessToken || res.jwt || null;
      let expiry = null;
      if (token) {
        try {
          // Decodifica el JWT (asume formato JWT: header.payload.signature)
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp) {
            expiry = payload.exp * 1000; // JWT exp es en segundos
          }
        } catch {}
      }
      const sessionToSave = { ...userData, token, expiry };
      await AsyncStorage.setItem('@userSession', JSON.stringify(sessionToSave));
      setUser(sessionToSave);
      Alert.alert(t(lang, 'login', 'success'), t(lang, 'login', 'welcome'));
    } catch (err: any) {
      Alert.alert(t(lang, 'errors', 'error'), err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>{t(lang, 'login', 'title')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t(lang, 'login', 'username')}
        placeholderTextColor={colors.inputPlaceholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder={t(lang, 'login', 'password')}
        placeholderTextColor={colors.inputPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <CustomButton title={t(lang, 'login', 'login')} onPress={handleLogin} disabled={loading} style={styles.button} textStyle={styles.buttonText} />
      <Text style={{ color: colors.textSecondary, marginTop: 16, textAlign: 'center' }}>
        {t(lang, 'login', 'noAccount')} <Text style={{ color: colors.button, textDecorationLine: 'underline' }} onPress={() => navigation.navigate('SignUp')}>{t(lang, 'login', 'register')}</Text>
      </Text>
      {loading && <Text style={{ marginTop: 10, textAlign: 'center', color: colors.textSecondary }}>{t(lang, 'login', 'loggingIn')}</Text>}
    </View>
  );
};

export default LoginScreen;
