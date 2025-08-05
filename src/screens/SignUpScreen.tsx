import React, { useState, useEffect, useContext } from 'react';
import { t } from '../i18n';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colorPalettes } from '../theme/colors';
import { ThemeContext, UserContext } from '../App';
import CustomButton from '../components/CustomButton';
import { signUp } from '../services/authService';
import { initializeDeviceUUID } from '../services/bleService';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
  Login: undefined;
};

const makeStyles = (colors: typeof colorPalettes['dark']) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  input: {
    backgroundColor: colors.input,
    color: colors.inputText,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  uuidText: {
    color: colors.textSecondary,
    marginBottom: 15,
    fontSize: 12,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  errorText: {
    color: colors.error,
    marginTop: 5,
    fontSize: 12,
  },
  successText: {
    color: colors.success,
    marginTop: 10,
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

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useContext(ThemeContext);
  const { lang } = useContext(UserContext);
  const colors = colorPalettes[theme as 'dark' | 'light'] || colorPalettes.dark;
  const styles = makeStyles(colors);

  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student', // Solo lectura
    matricula: '',
    user_uuid: '', // Solo lectura
    profile_image: null as any,
  });
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceUUID, setDeviceUUID] = useState('');

  useEffect(() => {
    console.log('🔧 [SIGNUP] Inicializando UUID del dispositivo...');
    // Generar UUID automáticamente
    initializeDeviceUUID(
      (msg) => {
        console.log('📱 [UUID INIT]', msg);
      },
      (uuid) => {
        console.log('✅ [UUID] UUID generado:', uuid);
        setDeviceUUID(uuid);
        setFormData(prev => ({ ...prev, user_uuid: uuid }));
      },
      () => {
        console.log('✅ [UUID] Inicialización completada');
      }
    );
  }, []);

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setImageUri(asset.uri || '');
          setFormData({ ...formData, profile_image: asset });
        }
      }
    );
  };

  const getErrorMessage = (error: any, statusCode?: number): string => {
    console.log('🔍 [SIGNUP] Analizando error:', { error, statusCode });
    
    // Verificar si hay un mensaje específico del servidor
    if (error?.response?.data?.message) {
      const serverMessage = error.response.data.message.toLowerCase();
      console.log('📝 [SIGNUP] Mensaje del servidor:', serverMessage);
      
      // Mapear mensajes específicos
      if (serverMessage.includes('email already exists') || serverMessage.includes('email ya existe')) {
        return 'Este email ya está registrado. ¿Quieres iniciar sesión?';
      }
      if (serverMessage.includes('matricula already exists') || serverMessage.includes('matrícula ya existe')) {
        return 'Esta matrícula ya está registrada. Verifica el número.';
      }
      if (serverMessage.includes('invalid email') || serverMessage.includes('email inválido')) {
        return 'El formato del email no es válido.';
      }
      if (serverMessage.includes('password too short') || serverMessage.includes('contraseña muy corta')) {
        return 'La contraseña debe tener al menos 8 caracteres.';
      }
      if (serverMessage.includes('invalid matricula') || serverMessage.includes('matrícula inválida')) {
        return 'El formato de la matrícula no es válido.';
      }
      
      return error.response.data.message;
    }

    // Verificar mensaje directo del error (respuesta JSON)
    if (error?.message && typeof error.message === 'string') {
      const errorMessage = error.message.toLowerCase();
      console.log('📝 [SIGNUP] Mensaje de error directo:', errorMessage);
      
      if (errorMessage.includes('email already exists') || errorMessage.includes('email ya existe')) {
        return 'Este email ya está registrado. ¿Quieres iniciar sesión?';
      }
      if (errorMessage.includes('matricula already exists') || errorMessage.includes('matrícula ya existe')) {
        return 'Esta matrícula ya está registrada. Verifica el número.';
      }
      if (errorMessage.includes('validation failed') || errorMessage.includes('invalid data')) {
        return 'Los datos ingresados no son válidos. Verifica que el email tenga formato correcto y la contraseña tenga al menos 8 caracteres.';
      }
    }
    
    // Verificar por código de estado
    if (statusCode) {
      console.log('🔢 [SIGNUP] Analizando por código de estado:', statusCode);
      switch (statusCode) {
        case 400:
          return 'Datos inválidos. Verifica que el email tenga formato correcto y la contraseña tenga al menos 8 caracteres.';
        case 409:
          return 'El email o matrícula ya están registrados.';
        case 422:
          return 'La información no cumple con los requisitos del servidor.';
        case 500:
          return 'Error del servidor. Intenta más tarde.';
        case 503:
          return 'Servicio temporalmente no disponible.';
      }
    }
    
    // Mensajes por defecto según el tipo de error
    if (error?.message) {
      const msg = error.message.toLowerCase();
      if (msg.includes('network') || msg.includes('fetch')) {
        return 'Error de conexión. Verifica tu conexión a internet.';
      }
      if (msg.includes('timeout') || msg.includes('aborted')) {
        return 'La conexión tardó demasiado. Intenta nuevamente.';
      }
      return error.message;
    }
    
    console.log('❓ [SIGNUP] Error no identificado, usando mensaje por defecto');
    return 'Error inesperado al crear la cuenta. Verifica los datos e intenta nuevamente.';
  };

  const handleSignUp = async () => {
    console.log('🚀 [SIGNUP] Iniciando proceso de registro...');
    
    // Validaciones básicas
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      console.log('❌ [SIGNUP] Campos obligatorios vacíos');
      Alert.alert('Error', 'Todos los campos obligatorios deben ser completados');
      return;
    }

    if (!formData.matricula.trim()) {
      console.log('❌ [SIGNUP] Matrícula vacía');
      Alert.alert('Error', 'La matrícula es requerida');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log('❌ [SIGNUP] Email con formato inválido');
      Alert.alert('Error', 'El formato del email no es válido');
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 8) {
      console.log('❌ [SIGNUP] Contraseña muy corta');
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!deviceUUID) {
      console.log('❌ [SIGNUP] UUID del dispositivo no disponible');
      Alert.alert('Error', 'El UUID del dispositivo no está disponible. Intenta nuevamente.');
      return;
    }

    console.log('📋 [SIGNUP] Datos del formulario:', {
      name: formData.name,
      email: formData.email,
      password: '***HIDDEN***', // No mostrar la contraseña en logs
      matricula: formData.matricula,
      role: 'Student',
      user_uuid: deviceUUID,
      hasImage: !!formData.profile_image
    });

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', 'Student');
      formDataToSend.append('matricula', formData.matricula);
      formDataToSend.append('user_uuid', deviceUUID);
      
      // Log de datos que se envían (sin mostrar password)
      console.log('📤 [SIGNUP] FormData que se envía:', {
        name: formData.name,
        email: formData.email,
        password: formData.password ? `${formData.password.length} caracteres` : 'No definido',
        role: 'Student',
        matricula: formData.matricula,
        user_uuid: deviceUUID,
        hasImage: !!formData.profile_image
      });

      // Verificar que todos los campos están presentes
      console.log('🔍 [SIGNUP] Verificación de campos:');
      console.log('  - Nombre:', formData.name ? '✅' : '❌');
      console.log('  - Email:', formData.email ? '✅' : '❌');  
      console.log('  - Password:', formData.password ? '✅' : '❌');
      console.log('  - Matrícula:', formData.matricula ? '✅' : '❌');
      console.log('  - UUID:', deviceUUID ? '✅' : '❌');
      
      if (formData.profile_image) {
        console.log('📸 [SIGNUP] Agregando imagen de perfil:', {
          fileName: formData.profile_image.fileName,
          type: formData.profile_image.type,
          uri: formData.profile_image.uri?.substring(0, 50) + '...'
        });
        formDataToSend.append('profile_image', {
          uri: formData.profile_image.uri,
          type: formData.profile_image.type,
          name: formData.profile_image.fileName || 'profile.jpg',
        } as any);
      }

      console.log('🌐 [SIGNUP] Enviando solicitud a API...');
      const startTime = Date.now();

      // Crear AbortController para timeout personalizado
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏱️ [SIGNUP] Timeout alcanzado (15s)');
        controller.abort();
      }, 15000); // 15 segundos timeout

      const response = await fetch('https://api-schoolguardian.onrender.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formDataToSend,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`📊 [SIGNUP] Respuesta recibida en ${duration}ms:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      let data;
      try {
        data = await response.json();
        console.log('📄 [SIGNUP] Datos de respuesta:', data);
      } catch (parseError) {
        console.error('❌ [SIGNUP] Error al parsear JSON:', parseError);
        throw new Error('Respuesta del servidor no es válida');
      }

      if (response.ok) {
        console.log('✅ [SIGNUP] Registro exitoso');
        Alert.alert(
          '¡Cuenta Creada!',
          'Tu cuenta ha sido creada exitosamente. Revisa tu email para activarla antes de iniciar sesión.',
          [
            { text: 'Continuar', onPress: () => navigation.goBack() }
          ]
        );
      } else {
        const statusCode = response.status;
        console.log(`❌ [SIGNUP] Error del servidor - Status: ${statusCode}`, data);
        const errorMessage = getErrorMessage(data, statusCode);
        Alert.alert('Error al Crear Cuenta', errorMessage);
      }
    } catch (error: any) {
      console.error('💥 [SIGNUP] Error completo:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });

      let errorMessage = '';
      if (error.name === 'AbortError') {
        errorMessage = 'La conexión tardó demasiado tiempo. Verifica tu conexión a internet.';
      } else {
        errorMessage = getErrorMessage(error);
      }
      
      Alert.alert('Error de Conexión', errorMessage);
    } finally {
      setLoading(false);
      console.log('🏁 [SIGNUP] Proceso finalizado');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: colors.card }}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 22 }}>Crear Cuenta</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Imagen de perfil */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity onPress={selectImage}>
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: imageUri || 'https://via.placeholder.com/120' }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: colors.card,
                }}
              />
              <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: colors.button,
                borderRadius: 20,
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8 }}>
            Seleccionar foto de perfil
          </Text>
        </View>

        {/* Formulario */}
        <View style={{ gap: 20 }}>
          {/* Mostrar UUID del dispositivo para debug */}
          {deviceUUID && (
            <View style={{ 
              backgroundColor: colors.card, 
              padding: 12, 
              borderRadius: 8, 
              marginBottom: 10 
            }}>
              <Text style={{ 
                color: colors.textSecondary, 
                fontSize: 12, 
                fontWeight: '600' 
              }}>
                UUID del Dispositivo:
              </Text>
              <Text style={{ 
                color: colors.text, 
                fontSize: 10, 
                fontFamily: 'monospace' 
              }}>
                {deviceUUID}
              </Text>
            </View>
          )}

          <View>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Nombre *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Nombre completo"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Email *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Contraseña *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
          </View>

          <View>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Matrícula *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.matricula}
              onChangeText={(text) => setFormData({ ...formData, matricula: text })}
              placeholder="Número de matrícula"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Botón de registro */}
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          style={{
            backgroundColor: colors.button,
            borderRadius: 16,
            padding: 18,
            alignItems: 'center',
            marginTop: 32,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              Crear Cuenta
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{ alignItems: 'center', marginTop: 20 }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
            ¿Ya tienes cuenta? <Text style={{ color: colors.button, fontWeight: 'bold' }}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
