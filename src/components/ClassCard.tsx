import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ClassCardProps {
  name: string;
  room: string;
  image: string;
  colors: any;
  onPress: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ name, room, image, colors, onPress }) => (
  <TouchableOpacity
    style={{
      backgroundColor: colors.card,
      borderRadius: 20,
      width: 160,
      height: 180,
      margin: 10,
      padding: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    }}
    onPress={onPress}
  >
    <Image source={{ uri: image }} style={{ width: 130, height: 80, borderRadius: 14, marginBottom: 10 }} />
    <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>{name}</Text>
    <Text style={{ color: colors.textSecondary, fontSize: 15 }}>{room}</Text>
  </TouchableOpacity>
);

export default ClassCard;
