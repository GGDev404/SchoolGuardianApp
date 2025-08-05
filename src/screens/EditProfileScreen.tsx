import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext, UserContext } from '../contexts/AppContexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useScreenStyles } from '../hooks/useStyles';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);
  const { colors, styles, common } = useScreenStyles('auth');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    matricula: user?.matricula || '',
    password: '',
    profile_image: null as any,
  });
  const [imageUri, setImageUri] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

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
    // Verificar si hay un mensaje específico del servidor
    if (error?.response?.data?.message) {
      const serverMessage = error.response.data.message.toLowerCase();
      
      // Mapear mensajes específicos
      if (serverMessage.includes('unauthorized') || serverMessage.includes('no autorizado')) {
        return 'Sesión expirada. Inicia sesión nuevamente.';
      }
      if (serverMessage.includes('matricula already exists') || serverMessage.includes('matrícula ya existe')) {
        return 'Esta matrícula ya está registrada por otro usuario.';
      }
      if (serverMessage.includes('invalid image') || serverMessage.includes('imagen inválida')) {
        return 'El formato de imagen no es válido. Usa JPG o PNG.';
      }
      if (serverMessage.includes('file too large') || serverMessage.includes('archivo muy grande')) {
        return 'La imagen es muy grande. Máximo 5MB.';
      }
      if (serverMessage.includes('password too short') || serverMessage.includes('contraseña muy corta')) {
        return 'La nueva contraseña debe tener al menos 8 caracteres.';
      }
      
      return error.response.data.message;
    }
    
    // Verificar por código de estado
    if (statusCode) {
      switch (statusCode) {
        case 401:
          return 'Sesión expirada. Inicia sesión nuevamente.';
        case 403:
          return 'No tienes permisos para realizar esta acción.';
        case 409:
          return 'La matrícula ya está registrada por otro usuario.';
        case 413:
          return 'La imagen es muy grande. Máximo 5MB.';
        case 422:
          return 'Los datos no cumplen con los requisitos.';
        case 500:
          return 'Error del servidor. Intenta más tarde.';
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
    
    return 'Error inesperado al actualizar el perfil.';
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.matricula) formDataToSend.append('matricula', formData.matricula);
      if (formData.password) formDataToSend.append('password', formData.password);
      if (formData.profile_image) {
        formDataToSend.append('profile_image', {
          uri: formData.profile_image.uri,
          type: formData.profile_image.type,
          name: formData.profile_image.fileName || 'profile.jpg',
        } as any);
      }

      const response = await fetch(`https://api-schoolguardian.onrender.com/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar los datos del usuario en el contexto y refrescar imagen
        const newAvatar = data.profile_image_url || (formData.profile_image ? formData.profile_image.uri : imageUri);
        const updatedUser = {
          ...user,
          id: user?.id || '', // Ensure id is always a string
          email: user?.email || '', // Ensure email is always a string
          name: data.name || formData.name,
          matricula: formData.matricula || user?.matricula, // Guardar matrícula del formulario
          avatar: newAvatar,
        };
        
        // Guardar en AsyncStorage y actualizar contexto
        await AsyncStorage.setItem('@userSession', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setImageUri(newAvatar);
        Alert.alert('¡Perfil Actualizado!', 'Tu perfil ha sido actualizado correctamente.');
        navigation.goBack();
      } else {
        const statusCode = response.status;
        const errorMessage = getErrorMessage(data, statusCode);
        Alert.alert('Error al Actualizar', errorMessage);
      }
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      const errorMessage = getErrorMessage(error);
      Alert.alert('Error de Conexión', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: colors.card }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 22 }}>Editar Perfil</Text>
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
            Toca para cambiar foto
          </Text>
        </View>

        {/* Formulario */}
        <View style={{ gap: 20 }}>
          <View>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Nombre *
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.input,
                borderRadius: 12,
                padding: 16,
                color: colors.text,
                fontSize: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Ingresa tu nombre"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Matrícula
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.input,
                borderRadius: 12,
                padding: 16,
                color: colors.text,
                fontSize: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              value={formData.matricula}
              onChangeText={(text) => setFormData({ ...formData, matricula: text })}
              placeholder="Número de matrícula"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Nueva Contraseña (opcional)
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.input,
                borderRadius: 12,
                padding: 16,
                color: colors.text,
                fontSize: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              placeholder="Deja vacío para mantener la actual"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
          </View>
        </View>

        {/* Botón de actualizar */}
        <TouchableOpacity
          onPress={handleUpdateProfile}
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
              Actualizar Perfil
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
