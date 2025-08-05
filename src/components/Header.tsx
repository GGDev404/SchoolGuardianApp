import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useScreenStyles } from '../hooks/useStyles';
import { UserContext } from '../contexts/AppContexts';

interface HeaderProps {
  onAvatarPress?: () => void;
  activeTab: 'home' | 'calendar';
  advertisingBadgeColor: string;
  advertisingBadgeText: string;
  isAdvertising: boolean;
  bluetoothState: string;
  onStartAdvertising: () => void;
  onStopAdvertising: () => void;
  unviewedCount: number;
  onNotificationsPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAvatarPress,
  activeTab,
  advertisingBadgeColor,
  advertisingBadgeText,
  isAdvertising,
  bluetoothState,
  onStartAdvertising,
  onStopAdvertising,
  unviewedCount,
  onNotificationsPress
}) => {
  const { colors, styles, common } = useScreenStyles('home');
  const { user } = useContext(UserContext);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onAvatarPress}>
        <Image 
          source={{ uri: user?.avatar || 'https://s3.amazonaws.com/uploads-dev-vtxapp-net/athletes/profile/dev_AT_vtx.com_2025_07_28_11_01_54.png' }} 
          style={common.avatar} 
        />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {activeTab === 'home' ? (
          <TouchableOpacity
            style={[styles.advertisingBadge, { backgroundColor: advertisingBadgeColor }]} 
            onPress={bluetoothState === 'PoweredOn'
              ? (isAdvertising ? onStopAdvertising : onStartAdvertising)
              : undefined}
          >
            <Text style={styles.advertisingText}>{advertisingBadgeText}</Text>
          </TouchableOpacity>
        ) : (
          <Ionicons name="calendar-outline" size={28} color={colors.button} />
        )}
        {/* Icono de notificaciones con badge si hay nuevas */}
        <TouchableOpacity
          onPress={onNotificationsPress}
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
  );
};

export default Header;
