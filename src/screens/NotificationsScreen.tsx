

import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colorPalettes } from '../theme/colors';
import { ThemeContext } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme } = useContext(ThemeContext);
  const colors = colorPalettes[theme as 'dark' | 'light'] || colorPalettes.dark;
  const route = useRoute();
  type NotificationsParams = { notifications?: string[] };
  const params = route.params as NotificationsParams || {};
  const initialNotifications = params.notifications || [];
  const [notifications, setNotifications] = useState<string[]>(initialNotifications);
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(new Set());

  // Cargar notificaciones vistas
  const loadViewedNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('@viewedNotifications');
      if (stored) {
        setViewedNotifications(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Error loading viewed notifications:', error);
    }
  };

  React.useEffect(() => {
    loadViewedNotifications();
  }, []);

  // Sincroniza notificaciones en tiempo real usando listener de navegación
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Actualiza notificaciones cada vez que la pantalla se enfoca
      const routeParams = (navigation.getState()?.routes?.find((r: any) => r.name === 'Notifications')?.params as NotificationsParams) || {};
      if (Array.isArray(routeParams.notifications)) {
        setNotifications(routeParams.notifications);
      }
    });
    return unsubscribe;
  }, [navigation]);
  
  const clearAllNotifications = async () => {
    Alert.alert(
      'Limpiar notificaciones',
      '¿Estás seguro de que quieres eliminar todas las notificaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          style: 'destructive',
          onPress: async () => {
            setNotifications([]);
            // Limpiar también las notificaciones vistas
            await AsyncStorage.removeItem('@viewedNotifications');
            // Actualiza los params para HomeScreen pero NO navega
            navigation.setParams({ notifications: [] });
            // Notificar al HomeScreen que limpie todo
            navigation.navigate('Home', { clearNotifications: true });
          }
        }
      ]
    );
  };

  const removeNotification = (index: number) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
    navigation.setParams({ notifications: updatedNotifications });
  };

  const NotificationItem: React.FC<{ message: string; index: number }> = ({ message, index }) => {
    const translateX = React.useRef(new Animated.Value(0)).current;
    const isViewed = viewedNotifications.has(message);

    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: false }
    );

    const onHandlerStateChange = (event: any) => {
      if (event.nativeEvent.state === State.END) {
        const { translationX } = event.nativeEvent;
        
        if (Math.abs(translationX) > 100) {
          // Si desliza más de 100px, eliminar la notificación
          Animated.timing(translateX, {
            toValue: translationX > 0 ? 300 : -300,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            removeNotification(index);
            translateX.setValue(0);
          });
        } else {
          // Si no desliza lo suficiente, regresar a la posición original
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      }
    };

    return (
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={{
            transform: [{ translateX }],
            backgroundColor: colors.card,
            borderRadius: 16,
            borderColor: colors.border,
            borderWidth: 1,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            opacity: isViewed ? 0.7 : 1, // Más transparente si ya fue vista
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isViewed 
                  ? colors.textSecondary // Gris si ya fue vista
                  : message.includes('Presente')
                    ? colors.success
                    : message.includes('Ausente')
                    ? colors.error
                    : colors.warning,
                marginRight: 12,
              }}
            />
            <Text style={{ 
              color: isViewed ? colors.textSecondary : colors.text, 
              fontSize: 16, 
              fontWeight: isViewed ? '400' : '500', 
              flex: 1 
            }}>
              {message}
            </Text>
            <View style={{ alignItems: 'flex-end' }}>
              {!isViewed && (
                <View style={{
                  backgroundColor: colors.button,
                  borderRadius: 8,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginBottom: 4,
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>NUEVA</Text>
                </View>
              )}
              <Text style={{ color: colors.textSecondary, fontSize: 12, fontStyle: 'italic' }}>
                Desliza para eliminar
              </Text>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['left', 'right', 'top']}>
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: colors.card }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 22 }}>Notificaciones</Text>
        </View>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAllNotifications} style={{ backgroundColor: colors.error, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        {notifications.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontSize: 16, marginTop: 16, textAlign: 'center' }}>
              No hay notificaciones nuevas.
            </Text>
          </View>
        ) : (
          <View>
            <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
              Desliza las notificaciones hacia los lados para eliminarlas individualmente
            </Text>
            {notifications.map((msg: string, idx: number) => (
              <NotificationItem key={idx} message={msg} index={idx} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
