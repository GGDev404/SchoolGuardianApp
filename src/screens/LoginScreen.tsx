import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useScreenStyles } from '../hooks/useStyles';
import { UserContext } from '../contexts/AppContexts';
import { useTranslation } from '../hooks/useTranslation';
import { login } from '../services/loginService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';

type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
  Login: undefined;
};

const LoginScreen = () => {
  const { colors, styles, common } = useScreenStyles('auth');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setUser, lang } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceUUID, setDeviceUUID] = useState('');
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();

  React.useEffect(() => {
    // Recuperar el UUID del dispositivo si existe en AsyncStorage
    AsyncStorage.getItem('@deviceUUID').then(uuid => {
      if (uuid) setDeviceUUID(uuid);
    });
  }, []);

  const getErrorMessage = (error: any, statusCode?: number): string => {
    // Verificar si hay un mensaje específico del servidor
    if (error?.response?.data?.message) {
      const serverMessage = error.response.data.message.toLowerCase();
      
      // Mapear mensajes específicos
      if (serverMessage.includes('invalid credentials') || serverMessage.includes('credenciales inválidas')) {
        return 'Las credenciales son incorrectas. Verifica tu email y contraseña.';
      }
      if (serverMessage.includes('account not activated') || serverMessage.includes('cuenta no activada')) {
        return 'Tu cuenta aún no ha sido activada. Revisa tu email para activarla.';
      }
      if (serverMessage.includes('user not found') || serverMessage.includes('usuario no encontrado')) {
        return 'No existe una cuenta con este email. ¿Necesitas registrarte?';
      }
      if (serverMessage.includes('account suspended') || serverMessage.includes('cuenta suspendida')) {
        return 'Tu cuenta ha sido suspendida. Contacta al administrador.';
      }
      if (serverMessage.includes('too many attempts') || serverMessage.includes('muchos intentos')) {
        return 'Demasiados intentos fallidos. Espera unos minutos antes de intentar nuevamente.';
      }
      
      return error.response.data.message;
    }
    
    // Verificar por código de estado
    if (statusCode) {
      switch (statusCode) {
        case 401:
          return 'Credenciales incorrectas o cuenta no activada. Verifica tus datos.';
        case 403:
          return 'Acceso denegado. Tu cuenta puede estar suspendida.';
        case 404:
          return 'No se encontró una cuenta con este email.';
        case 429:
          return 'Demasiados intentos. Espera unos minutos.';
        case 500:
          return 'Error del servidor. Intenta más tarde.';
        case 503:
          return 'Servicio temporalmente no disponible.';
      }
    }
    
    // Mensajes por defecto según el tipo de error
    if (error?.message) {
      if (error.message.includes('Network')) {
        return 'Error de conexión. Verifica tu internet.';
      }
      if (error.message.includes('timeout')) {
        return 'La conexión tardó demasiado. Intenta nuevamente.';
      }
      return error.message;
    }
    
    return 'Error inesperado. Intenta nuevamente.';
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t( 'errors', 'error'), t( 'login', 'errorRequired'));
      return;
    }
    setLoading(true);
    const start = Date.now();
    console.log('[Login] Start login at', new Date(start).toISOString());
    try {
      // Timeout logic
      const TIMEOUT_MS = 10000; // 10 seconds
      const loginPromise = login({ email, password, user_uuid: deviceUUID });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('La API no responde. Intenta más tarde.')), TIMEOUT_MS)
      );
      const res = await Promise.race([loginPromise, timeoutPromise]);
      const apiEnd = Date.now();
      console.log('[Login] API response at', new Date(apiEnd).toISOString(), 'Elapsed:', apiEnd - start, 'ms');
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
      // Incluir la URL de la imagen de perfil si existe
      const sessionToSave = { 
        ...userData, 
        token, 
        expiry,
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        matricula: userData.matricula || '', // Asegurar que la matrícula se guarde
        user_uuid: userData.user_uuid || '',
        avatar: userData.profile_image_url || userData.avatar || 'https://s3.amazonaws.com/uploads-dev-vtxapp-net/athletes/profile/dev_AT_vtx.com_2025_07_28_11_01_54.png'
      };
      await AsyncStorage.setItem('@userSession', JSON.stringify(sessionToSave));
      const end = Date.now();
      console.log('[Login] Session saved and user set at', new Date(end).toISOString(), 'Total elapsed:', end - start, 'ms');
      setUser(sessionToSave);
      Alert.alert(t( 'login', 'success'), t( 'login', 'welcome'));
    } catch (err: any) {
      const errorTime = Date.now();
      console.log('[Login] Error at', new Date(errorTime).toISOString(), 'Elapsed:', errorTime - start, 'ms', 'Error:', err);
      
      // Obtener el código de estado si está disponible
      const statusCode = err?.response?.status || err?.status;
      const errorMessage = getErrorMessage(err, statusCode);
      
      Alert.alert('Error de Inicio de Sesión', errorMessage);
    } finally {
      setLoading(false);
      const finish = Date.now();
      console.log('[Login] Finished at', new Date(finish).toISOString(), 'Total elapsed:', finish - start, 'ms');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.authContainer}>
          {/* Título */}
          <View style={styles.logoSection}>
            <Ionicons name="school" size={60} color={colors.button} style={{ marginBottom: 16 }} />
            <Text style={styles.title}>
              {t( 'login', 'title')}
            </Text>
            <Text style={styles.subtitle}>
              Ingresa a tu cuenta de estudiante
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formSection}>
            <View>
              <Text style={styles.label}>
                Email
              </Text>
              <TextInput
                style={styles.input}
                placeholder="correo@ejemplo.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View>
              <Text style={styles.label}>
                Contraseña
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
          </View>

          {/* Botón de inicio de sesión */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading || !email.trim() || !password.trim()}
            style={[
              styles.loginButton,
              { opacity: (loading || !email.trim() || !password.trim()) ? 0.7 : 1 }
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>
                  Iniciar Sesión
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Enlaces adicionales */}
          <View style={styles.authLinks}>
            <TouchableOpacity>
              <Text style={{ 
                color: colors.button, 
                fontSize: 16, 
                textDecorationLine: 'underline' 
              }}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                ¿No tienes cuenta? <Text style={{ color: colors.button, fontWeight: 'bold' }}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Información adicional */}
          <View style={styles.infoCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="information-circle" size={20} color={colors.button} style={{ marginRight: 8 }} />
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                Información importante
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
              • Si es tu primer ingreso, revisa tu email para activar tu cuenta{'\n'}
              • En caso de problemas, contacta al administrador{'\n'}
              • Asegúrate de usar el email registrado en tu matrícula
            </Text>
          </View>

          {loading && (
            <View style={[styles.infoCard, { marginTop: 16 }]}>
              <Text style={{ color: colors.text, fontSize: 14, textAlign: 'center' }}>
                Verificando credenciales...
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                Esto puede tomar unos segundos
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LoginScreen;
