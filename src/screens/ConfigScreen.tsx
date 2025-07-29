import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
import { t, SupportedLang } from '../i18n';
const ConfigScreen = ({ navigation }: any) => {
  const { setUser, lang, setLang } = useContext(UserContext);
  const [userLocal, setUserLocal] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@userSession').then(session => {
      if (session) {
        const sessionData = JSON.parse(session);
        // Si la respuesta tiene la propiedad 'user', usarla
        const userData = sessionData.user || sessionData;
        setUserLocal(userData);
        setName(userData.name || '');
        setEmail(userData.email || '');
      }
    });
  }, []);

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Nombre y email son obligatorios');
      return;
    }
    // Actualizar localmente y en el backend si lo deseas
    const updatedUser = { ...userLocal, name, email };
    await AsyncStorage.setItem('@userSession', JSON.stringify(updatedUser));
    setUserLocal(updatedUser);
    setUser(updatedUser);
    Alert.alert('Guardado', 'Datos actualizados correctamente');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>{t(lang, 'config', 'title')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t(lang, 'config', 'name')}
        placeholderTextColor={colors.inputPlaceholder}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder={t(lang, 'config', 'email')}
        placeholderTextColor={colors.inputPlaceholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <CustomButton title={t(lang, 'config', 'save')} onPress={handleSave} style={styles.button} textStyle={styles.buttonText} />
      <CustomButton
        title={t(lang, 'config', 'logout')}
        onPress={async () => {
          await AsyncStorage.removeItem('@userSession');
          setUser(null);
        }}
        style={[styles.button, { backgroundColor: colors.error }]}
        textStyle={styles.buttonText}
      />
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.text, fontWeight: 'bold', marginBottom: 8 }}>{'Language / Idioma'}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <CustomButton
            title="English"
            onPress={() => setLang('en')}
            style={{ backgroundColor: lang === 'en' ? colors.button : colors.card, marginRight: 8, paddingHorizontal: 16 }}
            textStyle={{ color: lang === 'en' ? colors.buttonText : colors.text }}
          />
          <CustomButton
            title="Español"
            onPress={() => setLang('es')}
            style={{ backgroundColor: lang === 'es' ? colors.button : colors.card, paddingHorizontal: 16 }}
            textStyle={{ color: lang === 'es' ? colors.buttonText : colors.text }}
          />
        </View>
      </View>
      <Text style={styles.infoText}>{t(lang, 'config', 'role')}: {userLocal?.role || '-'}</Text>
      {userLocal?.user_uuid && <Text style={styles.infoText}>UUID: {userLocal.user_uuid}</Text>}
    </ScrollView>
  );
};

export default ConfigScreen;
