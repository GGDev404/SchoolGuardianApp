// Pantalla principal de la app
import React, { useEffect, useState, useContext } from 'react';
import { t } from '../i18n';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { initializeDeviceUUID, checkBluetoothState, enableBluetooth, requestPermissions, startAdvertising, stopAdvertising } from '../services/bleService';
import { BleManager } from 'react-native-ble-plx';
import { STUDENT_ID } from '../constants';
import BleAdvertiser from 'react-native-ble-advertiser';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  classCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: 150,
    height: 140,
    marginRight: 10,
    padding: 10,
    alignItems: 'center',
  },
  classImage: {
    width: 120,
    height: 60,
    borderRadius: 12,
    marginBottom: 10,
  },
  classTitle: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  classSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
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
    paddingBottom: Platform.OS === 'android' ? 24 : 0, // espacio extra para barra navegación
  },
});


import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';


import { UserContext } from '../App';
const HomeScreen = () => {
  const { lang } = useContext(UserContext);
  const [isAdvertising, setIsAdvertising] = useState(false);
  const navigation = useNavigation<any>();
  const [bluetoothState, setBluetoothState] = useState('unknown');
  const [deviceUUID, setDeviceUUID] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  type User = {
    id?: string | number;
    user_uuid?: string;
    avatar?: string;
    
  };
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const bleManager = new BleManager();
    let lastState = '';
    const subscription = bleManager.onStateChange((state) => {
      if (state !== lastState) {
        console.log('[BLE] onStateChange:', state);
        setBluetoothState(state);
        lastState = state;
      }
    }, true);
    initializeDeviceUUID(() => {}, setDeviceUUID, setIsInitialized);
    const initialize = async () => {
      const session = await AsyncStorage.getItem('@userSession');
      if (session) setUser(JSON.parse(session));
      await requestPermissions(() => {});
      await BleAdvertiser.setCompanyId(0x1234);
    };
    initialize();
    return () => {
      subscription.remove();
      // bleManager.destroy(); // Do NOT destroy the global instance
    };
  }, []);

  const handleStartAdvertising = async () => {
    if (!isInitialized) {
      Alert.alert('Error', 'Device not initialized');
      return;
    }
    const studentId = user?.id ? Number(user.id) : STUDENT_ID;
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
      checkBluetoothStateFn: checkBluetoothState,
      enableBluetoothFn: enableBluetooth,
    });
    setIsAdvertising(!!success);
    if (!success) {
      Alert.alert('Error', 'Could not start advertising. ' + lastStatus);
    }
  };

  const handleStopAdvertising = async () => {
    await stopAdvertising(() => {}, () => {});
    setIsAdvertising(false);
  };

  // Estado del badge de advertising
  let advertisingBadgeColor = colors.error;
  let advertisingBadgeText = t(lang, 'home', 'advertising');
  // Normalize state for comparison
  const normalizedState = (bluetoothState || '').toLowerCase();
  if (normalizedState !== 'poweredon') {
    advertisingBadgeColor = colors.warning;
    advertisingBadgeText = `Bluetooth Off (${bluetoothState})`;
  } else if (isAdvertising) {
    advertisingBadgeColor = colors.success;
    advertisingBadgeText = t(lang, 'home', 'advertising');
  } else {
    advertisingBadgeColor = colors.button;
    advertisingBadgeText = t(lang, 'home', 'startAdvertising') || 'Start Advertising';
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {/* Header */}
      <View style={{
        ...styles.header,
        paddingTop: 0
      }}>
        <TouchableOpacity onPress={() => navigation.navigate('Config')}>
          <Image source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.avatar} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.advertisingBadge, { backgroundColor: advertisingBadgeColor }]}
          onPress={bluetoothState === 'PoweredOn' ? (isAdvertising ? handleStopAdvertising : handleStartAdvertising) : undefined}
        >
          <Text style={styles.advertisingText}>{advertisingBadgeText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="notifications-outline" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>


      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }} style={{ flex: 1 }}>
        {/* My Classes */}
        <Text style={styles.sectionTitle}>{t(lang, 'home', 'welcome')}</Text>
        <View style={styles.cardRow}>
          <View style={styles.classCard}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80' }} style={styles.classImage} />
            <Text style={styles.classTitle}>Mathematics</Text>
            <Text style={styles.classSubtitle}>Room 201</Text>
          </View>
          <View style={styles.classCard}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' }} style={styles.classImage} />
            <Text style={styles.classTitle}>Science</Text>
            <Text style={styles.classSubtitle}>Room 202</Text>
          </View>
        </View>

        {/* Announcements */}
        <Text style={styles.sectionTitle}>{t(lang, 'home', 'announcements')}</Text>
        <View style={styles.announcementCard}>
          <Text style={styles.announcementTitle}>School Event</Text>
          <Text style={styles.announcementText}>Join us for the annual school fair on Saturday!</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { position: 'absolute', left: 0, right: 0, bottom: 0 }]}> 
        <Ionicons name="home" size={28} color={colors.button} />
        <Ionicons name="calendar-outline" size={28} color={colors.textSecondary} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
