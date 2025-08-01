// Pantalla principal de la app
import React, { useEffect, useState, useContext } from 'react';
import { t } from '../i18n';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorPalettes } from '../theme/colors';
import { ThemeContext, UserContext } from '../App';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import BottomBar from '../components/BottomBar';
import ClassCard from '../components/ClassCard';
import { initializeDeviceUUID, checkBluetoothState, enableBluetooth, requestPermissions, startAdvertising, stopAdvertising } from '../services/bleService';
import CalendarScreen from './CalendarScreen';


function makeStyles(colors: typeof colorPalettes['dark']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 0,
      paddingTop: 20,
      paddingBottom: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 60,
      padding: 40,
      justifyContent: 'space-between',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
    },
    advertisingBadge: {
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginLeft: 10,
    },
    advertisingText: {
      color: colors.buttonText,
      fontWeight: 'bold',
      fontSize: 14,
    },
    icon: {
      marginLeft: 10,
    },
    sectionTitle: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 22,
      marginTop: 20,
      marginBottom: 10,
      marginLeft: 20,
    },
    cardRow: {
      flexDirection: 'column',
      marginHorizontal: 12,
      marginBottom: 20,
    },
    classCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      width: '97%',
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 4,
      elevation: 2,
    },
    classImage: {
      width: 54,
      height: 54,
      borderRadius: 12,
      marginRight: 16,
      backgroundColor: colors.background,
    },
    classInfo: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    classTitle: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 17,
      marginBottom: 2,
    },
    classSubtitle: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    announcementCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginHorizontal: 20,
      marginTop: 10,
      padding: 16,
    },
    announcementTitle: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
    },
    announcementText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    bottomBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: colors.card,
      paddingVertical: 12,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: Platform.OS === 'android' ? 24 : 0,
    },
  });
}




const HomeScreen = () => {
  // Contextos y hooks
  const { theme } = useContext(ThemeContext);
  const { lang, user, setUser } = useContext(UserContext);
  const navigation = useNavigation<any>();
  
  // Estados principales
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [advertisingError, setAdvertisingError] = useState<string | null>(null);
  const [bluetoothState, setBluetoothState] = useState('unknown');
  const [deviceUUID, setDeviceUUID] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'calendar'>('home');
  
  // Estado para la lista de notificaciones recibidas por WebSocket
  const [wsNotifications, setWsNotifications] = useState<string[]>([]);
  // Estado para las notificaciones ya vistas (persiste en AsyncStorage)
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(new Set());
  
  // Colores y estilos
  const colors = colorPalettes[theme as 'dark' | 'light'] || colorPalettes.dark;
  const styles = makeStyles(colors);

  // Funciones para manejar notificaciones vistas
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

  const saveViewedNotifications = async (viewedSet: Set<string>) => {
    try {
      await AsyncStorage.setItem('@viewedNotifications', JSON.stringify(Array.from(viewedSet)));
    } catch (error) {
      console.error('Error saving viewed notifications:', error);
    }
  };

  const markNotificationsAsViewed = async () => {
    const newViewedSet = new Set([...viewedNotifications, ...wsNotifications]);
    setViewedNotifications(newViewedSet);
    await saveViewedNotifications(newViewedSet);
  };

  const clearAllNotifications = async () => {
    setWsNotifications([]);
    setViewedNotifications(new Set());
    await AsyncStorage.removeItem('@viewedNotifications');
  };

  // Calcular notificaciones no vistas
  const unviewedNotifications = wsNotifications.filter(notification => !viewedNotifications.has(notification));
  const unviewedCount = unviewedNotifications.length;
  
  // Cargar notificaciones vistas al inicio
  useEffect(() => {
    loadViewedNotifications();
  }, []);

  // Limpiar notificaciones si se recibe el parámetro
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const currentRoute = navigation.getState()?.routes?.find((r: any) => r.name === 'Home');
      console.log('HomeScreen focus, params:', currentRoute?.params);
      if (currentRoute?.params?.clearNotifications) {
        console.log('Limpiando notificaciones...');
        clearAllNotifications();
        // Limpiar el parámetro para evitar bucles
        navigation.setParams({ clearNotifications: undefined });
      }
    });
    return unsubscribe;
  }, [navigation]);

  // WebSocket para notificaciones en tiempo real
  useEffect(() => {
    const ws = new WebSocket('wss://api-schoolguardian.onrender.com');
    ws.onopen = () => {
      console.log('WebSocket conectado');
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Si el mensaje es del tipo active_pings_update, busca el id del usuario actual
        if (data.type === 'active_pings_update' && Array.isArray(data.active_pings)) {
          const myPing = data.active_pings.find((ping: any) => ping.student && String(ping.student.id_user) === String(user?.id));
          if (myPing) {
            // Extrae el estado más reciente de asistencia
            const lastPing = Array.isArray(myPing.pings) ? myPing.pings[0] : null;
            const status = lastPing ? lastPing.status : 'Sin registro';
            const time = lastPing ? new Date(lastPing.ping_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '';
            const msg = `${status} ${time ? `a las ${time}` : ''}`;
            setWsNotifications(prev => [msg, ...prev].slice(0, 10));
          }
        } else if (data && data.notification) {
          setWsNotifications(prev => [data.notification, ...prev].slice(0, 10));
        } else if (typeof data === 'string') {
          setWsNotifications(prev => [data, ...prev].slice(0, 10));
        } else {
          setWsNotifications(prev => [event.data, ...prev].slice(0, 10));
        }
        console.log('WS mensaje:', data);
      } catch (e) {
        setWsNotifications(prev => [event.data, ...prev].slice(0, 10));
      }
    };
    ws.onerror = (err) => {
      console.log('WebSocket error:', err);
    };
    ws.onclose = () => {
      console.log('WebSocket cerrado');
    };
    return () => {
      ws.close();
    };
  }, []);
  // Configuración de idioma para el calendario
  LocaleConfig.locales['es'] = {
    monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
    dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  };
  LocaleConfig.defaultLocale = 'es';

  // Ejemplo de clases y asistencias para el calendario
  type ClassEvent = { name: string; time: string; attended: boolean };
  type ClassEventsMap = Record<string, ClassEvent[]>;
  const classEvents: ClassEventsMap = {
    '2025-07-30': [{ name: 'Mathematics', time: '8:00-9:30', attended: true }],
    '2025-07-31': [{ name: 'Science', time: '10:00-11:30', attended: false }],
    '2025-08-01': [{ name: 'Art', time: '12:00-13:30', attended: true }],
  };

  const getMarkedDates = (colors: any): Record<string, any> => {
    const marked: Record<string, any> = {};
    Object.keys(classEvents).forEach((date: string) => {
      marked[date] = {
        marked: true,
        dotColor: classEvents[date].some((e: ClassEvent) => !e.attended) ? colors.error : colors.success,
      };
    });
    return marked;
  };

  // Inicializa UUID y BLE state usando solo la instancia global del servicio
  // Controla el intervalo de estado BLE para evitar bucles
  useEffect(() => {
    initializeDeviceUUID(
      (msg) => console.log('[BLE INIT]', msg),
      setDeviceUUID,
      setIsInitialized
    );
    const checkState = async () => {
      const state = await checkBluetoothState(() => {}, setBluetoothState);
      setBluetoothState(state);
    };
    checkState();
    const interval = setInterval(checkState, 3000);
    import('react-native-ble-advertiser').then(mod => {
      mod.default.setCompanyId(0x1234);
    });
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Funciones de navegación inferior
  const handleNavigateHome = () => navigation.navigate('Home');
  const handleNavigateCalendar = () => navigation.navigate('Calendar');

  // Funciones de advertising
  const handleStartAdvertising = async (force = false) => {
    if (!isInitialized) {
      Alert.alert('Error', 'Device not initialized');
      return;
    }
    setAdvertisingError(null);
    await stopAdvertising(() => {}, () => {});
    setIsAdvertising(false);
    const studentId = user?.id ? Number(user.id) : 0;
    const uuidToSend = user?.user_uuid ? user.user_uuid : deviceUUID;
    if (!uuidToSend) {
      Alert.alert('Error', 'Device UUID not ready');
      return;
    }
    let lastStatus = '';
    const addLog = (msg: string) => console.log('[ADVERTISING]', msg);
    const setStatusMessage = (msg: string) => { lastStatus = msg; };
    const success = await startAdvertising({
      addLog,
      setStatusMessage,
      studentId,
      deviceUUID: uuidToSend,
      requestPermissionsFn: requestPermissions,
      checkBluetoothStateFn: async (addLog, setBluetoothState) => {
        const state = await checkBluetoothState(addLog, setBluetoothState);
        return String(state).toLowerCase() === 'poweredon';
      },
      enableBluetoothFn: enableBluetooth,
    });
    setIsAdvertising(!!success);
    if (!success) {
      setAdvertisingError('No se pudo iniciar el advertising. ' + lastStatus);
      Alert.alert('Error', 'No se pudo iniciar el advertising. ' + lastStatus);
      // Elimina el bucle infinito, no reintentar automáticamente
    }
  };

  const handleStopAdvertising = async () => {
    await stopAdvertising(() => {}, () => {});
    setIsAdvertising(false);
    setAdvertisingError(null);
  };

  // Limpia advertising al hacer logout
  useEffect(() => {
    return () => {
      stopAdvertising(() => {}, () => {});
      setIsAdvertising(false);
      setAdvertisingError(null);
    };
  }, [user]);

  // Estado del badge de advertising
  let advertisingBadgeColor = colors.error;
  let advertisingBadgeText = t(lang, 'home', 'advertising');
  const normalizedState = (bluetoothState || '').toLowerCase();
  if (normalizedState === 'poweredon') {
    if (isAdvertising) {
      advertisingBadgeColor = colors.success;
      advertisingBadgeText = t(lang, 'home', 'advertising');
    } else {
      advertisingBadgeColor = advertisingError ? colors.error : colors.button;
      advertisingBadgeText = advertisingError ? advertisingError : t(lang, 'home', 'startAdvertising');
    }
  } else {
    advertisingBadgeColor = colors.warning;
    advertisingBadgeText = `${t(lang, 'home', 'bluetoothOff')} (${bluetoothState})`;
  }

  // Lista de clases simuladas
  const classes = [
    {
      name: t(lang, 'home', 'Programing'),
      room: t(lang, 'home', 'room208'),
      time: '8:30 PM - 10:00 PM',
      image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      name: t(lang, 'home', 'mathematics'),
      room: t(lang, 'home', 'room201'),
      time: '8:00 AM - 9:30 AM',
      image: 'https://images.unsplash.com/photo-1676302447092-14a103558511?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      name: t(lang, 'home', 'science'),
      room: t(lang, 'home', 'room202'),
      time: '10:00 AM - 11:30 AM',
      image: 'https://images.unsplash.com/photo-1581093577421-f561a654a353?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      name: t(lang, 'home', 'history'),
      room: t(lang, 'home', 'room203'),
      time: '11:45 AM - 1:15 PM',
      image: 'https://plus.unsplash.com/premium_photo-1661963952208-2db3512ef3de?q=80&w=2144&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      name: t(lang, 'home', 'art'),
      room: t(lang, 'home', 'room204'),
      time: '1:30 PM - 3:00 PM',
      image: 'https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      name: t(lang, 'home', 'music'),
      room: t(lang, 'home', 'room205'),
      time: '3:15 PM - 4:45 PM',
      image: 'https://images.unsplash.com/photo-1481886756534-97af88ccb438?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      name: t(lang, 'home', 'english'),
      room: t(lang, 'home', 'room206'),
      time: '5:00 PM - 6:30 PM',
      image: 'https://images.unsplash.com/photo-1650848200302-22e62d26a75a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      name: t(lang, 'home', 'sports'),
      room: t(lang, 'home', 'room207'),
      time: '6:45 PM - 8:15 PM',
      image: 'https://images.unsplash.com/photo-1488424138610-252b5576e079?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    
  ];

  // Navegación real al tocar una clase
  const handleClassPress = (classInfo: any) => {
    navigation.navigate('ClassDetail', { classInfo });
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* Header horizontal con icono de notificaciones */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 30, 
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.card,
        backgroundColor: colors.background,
      }}>
        <TouchableOpacity onPress={() => navigation.navigate('Config')}>
          <Image source={{ uri: user?.avatar || 'https://s3.amazonaws.com/uploads-dev-vtxapp-net/athletes/profile/dev_AT_vtx.com_2025_07_28_11_01_54.png' }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {activeTab === 'home' ? (
            <TouchableOpacity
              style={[styles.advertisingBadge, { backgroundColor: advertisingBadgeColor }]} 
              onPress={bluetoothState === 'PoweredOn'
                ? (isAdvertising
                    ? () => handleStopAdvertising()
                    : () => handleStartAdvertising(false))
                : undefined}
            >
              <Text style={styles.advertisingText}>{advertisingBadgeText}</Text>
            </TouchableOpacity>
          ) : (
            <Ionicons name="calendar-outline" size={28} color={colors.button} />
          )}
          {/* Icono de notificaciones con badge si hay nuevas */}
          <TouchableOpacity
            onPress={() => {
              markNotificationsAsViewed();
              navigation.navigate('Notifications', { notifications: wsNotifications });
            }}
            style={{ marginLeft: 18 }}>
            <View>
              <Ionicons name="notifications-outline" size={28} color={colors.button} />
              {unviewedCount > 0 && (
                <View style={{ position: 'absolute', top: -2, right: -2, backgroundColor: colors.error, borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{unviewedCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'home' ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }} style={{ flex: 1 }}>
          <View style={styles.cardRow}>
            <Text style={styles.sectionTitle}>
              {t(lang, 'home', 'todaysClasses')}
            </Text>
            {classes.map((classInfo, idx) => (
              <TouchableOpacity key={idx} style={styles.classCard} onPress={() => handleClassPress(classInfo)}>
                <Image source={{ uri: classInfo.image }} style={styles.classImage} />
                <View style={styles.classInfo}>
                  <Text style={styles.classTitle}>{classInfo.name}</Text>
                  <Text style={styles.classSubtitle}>{classInfo.room}</Text>
                  <Text style={styles.classSubtitle}>{classInfo.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <CalendarScreen />
      )}

      <BottomBar
        activeTab={activeTab}
        onTabPress={setActiveTab}
        colors={colors}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
