import BleAdvertiser from 'react-native-ble-advertiser';
import { Buffer } from 'buffer';
import uuid from 'react-native-uuid';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

const bleManager = new BleManager();

export async function initializeDeviceUUID(addLog: (msg: string) => void, setDeviceUUID: (uuid: string) => void, setIsInitialized: (v: boolean) => void) {
  try {
    addLog('Inicializando UUID del dispositivo...');
    let storedUUID = await AsyncStorage.getItem('@deviceUUID');
    if (!storedUUID) {
      storedUUID = uuid.v4().replace(/-/g, '').substring(0, 16);
      await AsyncStorage.setItem('@deviceUUID', storedUUID);
      addLog(`Nuevo UUID generado: ${storedUUID}`);
    } else {
      addLog(`UUID recuperado: ${storedUUID}`);
    }
    setDeviceUUID(storedUUID);
    setIsInitialized(true);
  } catch (err: any) {
    addLog(`Error inicializando UUID: ${err.message}`);
    Alert.alert('Error', 'No se pudo inicializar el identificador del dispositivo');
  }
}

export async function checkBluetoothState(addLog: (msg: string) => void, setBluetoothState: (state: string) => void) {
  try {
    const state = await bleManager.state();
    setBluetoothState(state);
    addLog(`Estado Bluetooth: ${state}`);
    return state === 'PoweredOn';
  } catch (err: any) {
    addLog(`Error verificando Bluetooth: ${err.message}`);
    return false;
  }
}

export async function enableBluetooth(addLog: (msg: string) => void) {
  try {
    addLog('Intentando activar Bluetooth...');
    await bleManager.enable();
    addLog('Bluetooth activado con éxito');
    return true;
  } catch (err: any) {
    addLog(`Error activando Bluetooth: ${err.message}`);
    Alert.alert('Error', 'No se pudo activar el Bluetooth');
    return false;
  }
}

export async function requestPermissions(addLog: (msg: string) => void) {
  if (Platform.OS === 'android') {
    try {
      addLog('Solicitando permisos...');
      const apiLevel = typeof Platform.Version === 'number' ? Platform.Version : parseInt(Platform.Version, 10);
      const isAndroid12OrHigher = apiLevel >= 31;
      let permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ];
      if (!isAndroid12OrHigher) {
        permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        permissions.push('android.permission.BLUETOOTH' as any);
        permissions.push('android.permission.BLUETOOTH_ADMIN' as any);
      }
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const allGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED
      );
      if (!allGranted) {
        throw new Error('Permisos no concedidos');
      }
      addLog('Todos los permisos concedidos');
      return true;
    } catch (err: any) {
      addLog(`Error en permisos: ${err.message}`);
      Alert.alert('Error', 'Se necesitan todos los permisos para funcionar');
      return false;
    }
  }
  return true;
}
export function encodePayload(studentId: number, deviceUUID: string): number[] {
  if (!deviceUUID) throw new Error('UUID no inicializado');
  const buffer = Buffer.alloc(11); // 3 bytes ID + 8 bytes UUID
  buffer.writeUIntLE(studentId, 0, 3); // Escribir studentId en 3 bytes
  Buffer.from(deviceUUID, 'hex').copy(buffer, 3); // Escribir UUID en 8 bytes
  return Array.from(buffer);
}

export async function startAdvertising({
  addLog,
  setStatusMessage,
  studentId,
  deviceUUID,
  requestPermissionsFn,
  checkBluetoothStateFn,
  enableBluetoothFn,
}: {
  addLog: (msg: string) => void;
  setStatusMessage: (msg: string) => void;
  studentId: number;
  deviceUUID: string;
  requestPermissionsFn: (addLog: (msg: string) => void) => Promise<boolean>;
  checkBluetoothStateFn: (addLog: (msg: string) => void, setBluetoothState: (state: string) => void) => Promise<boolean>;
  enableBluetoothFn: (addLog: (msg: string) => void) => Promise<boolean>;
}) {
  setStatusMessage('Verificando requisitos...');
  addLog('Iniciando proceso de advertising');
  try {
    const hasPermissions = await requestPermissionsFn(addLog);
    if (!hasPermissions) throw new Error('Permisos insuficientes');
    setStatusMessage('Verificando Bluetooth...');
    const isBluetoothOn = await checkBluetoothStateFn(addLog, () => {});
    if (!isBluetoothOn) {
      setStatusMessage('Activando Bluetooth...');
      const enabled = await enableBluetoothFn(addLog);
      if (!enabled) throw new Error('Bluetooth no pudo ser activado');
    }
    setStatusMessage('Preparando payload...');
    const payload = encodePayload(studentId, deviceUUID);
    addLog(`Payload generado: ${JSON.stringify(payload)}`);
    setStatusMessage('Iniciando advertising...');
    await BleAdvertiser.broadcast(
      '0000FFF0-0000-1000-8000-00805F9B34FB',
      payload,
      {
        includeDeviceName: false,
        advertiseMode: 1,
        connectable: false,
        txPowerLevel: 1,
      }
    );
    addLog('Advertising iniciado con éxito');
    setStatusMessage('Advertising ACTIVO');
    return true;
  } catch (err: any) {
    addLog(`Error en el proceso: ${err.message}`);
    setStatusMessage('Error al iniciar');
    Alert.alert('Error', `No se pudo iniciar el advertising: ${err.message}`);
    return false;
  }
}

export async function stopAdvertising(addLog: (msg: string) => void, setStatusMessage: (msg: string) => void) {
  setStatusMessage('Deteniendo advertising...');
  try {
    await BleAdvertiser.stopBroadcast();
    addLog('Advertising detenido correctamente');
    setStatusMessage('Advertising INACTIVO');
  } catch (err: any) {
    addLog(`Error al detener advertising: ${err.message}`);
    setStatusMessage('Error al detener');
  }
}
