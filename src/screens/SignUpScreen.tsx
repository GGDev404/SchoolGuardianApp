import React, { useState, useEffect, useContext } from 'react';
import { t } from '../i18n';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { colors } from '../theme/colors';
import CustomButton from '../components/CustomButton';
import { signUp } from '../services/authService';
import { initializeDeviceUUID } from '../services/bleService';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
  Login: undefined;
};

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

import { UserContext } from '../App';
const SignUpScreen = () => {
  const { lang } = useContext(UserContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceUUID, setDeviceUUID] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeDeviceUUID(() => {}, setDeviceUUID, () => {});
  }, []);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert(t(lang, 'errors', 'error'), t(lang, 'signup', 'errorRequired'));
      return;
    }
    setLoading(true);
    try {
      const res = await signUp({
        name,
        email,
        password,
        role: 'Student',
        user_uuid: deviceUUID,
      });
      await import('@react-native-async-storage/async-storage').then(mod => mod.default.setItem('@userSession', JSON.stringify(res)));
      Alert.alert(t(lang, 'signup', 'success'), t(lang, 'signup', 'userCreated'), [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (err: any) {
      Alert.alert(t(lang, 'errors', 'error'), err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>{t(lang, 'signup', 'title')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t(lang, 'signup', 'name')}
        placeholderTextColor={colors.inputPlaceholder}
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder={t(lang, 'signup', 'email')}
        placeholderTextColor={colors.inputPlaceholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder={t(lang, 'signup', 'password')}
        placeholderTextColor={colors.inputPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <CustomButton title={t(lang, 'signup', 'register')} onPress={handleSignUp} disabled={loading} style={styles.button} textStyle={styles.buttonText} />
      <Text style={{ color: colors.textSecondary, marginTop: 16, textAlign: 'center' }}>
        {t(lang, 'signup', 'alreadyAccount')} <Text style={{ color: colors.button, textDecorationLine: 'underline' }} onPress={() => navigation.navigate('Login')}>{t(lang, 'signup', 'login')}</Text>
      </Text>
      {loading && <Text style={{ marginTop: 10, textAlign: 'center', color: colors.textSecondary }}>{t(lang, 'signup', 'register')}...</Text>}
      <Text style={styles.infoText}>UUID del dispositivo: {deviceUUID}</Text>
    </View>
  );
};

export default SignUpScreen;
