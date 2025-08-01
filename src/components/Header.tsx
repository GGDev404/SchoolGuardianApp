import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  title: string;
  avatar?: string;
  onAvatarPress?: () => void;
  iconName?: string;
  iconColor?: string;
  style?: any;
}

const Header: React.FC<HeaderProps> = ({ title, avatar, onAvatarPress, iconName = 'calendar-outline', iconColor = '#fff', style }) => (
  <View style={[styles.header, style]}>
    <TouchableOpacity onPress={onAvatarPress}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <Ionicons name="person-circle" size={40} color={iconColor} />
      )}
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <Ionicons name={iconName} size={28} color={iconColor} style={{ marginLeft: 10 }} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    marginLeft: 12,
  },
});

export default Header;
