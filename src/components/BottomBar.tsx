import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BottomBarProps {
  activeTab: 'home' | 'calendar';
  onTabPress: (tab: 'home' | 'calendar') => void;
  colors: any;
}

const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onTabPress, colors }) => (
  <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}> 
    <TouchableOpacity onPress={() => onTabPress('home')}>
      <Ionicons name="home" size={28} color={activeTab === 'home' ? colors.button : colors.textSecondary} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onTabPress('calendar')}>
      <Ionicons name="calendar-outline" size={28} color={activeTab === 'calendar' ? colors.button : colors.textSecondary} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // For Android shadow
    borderRadius: 16, // Optional: to match the card style
    zIndex: 1000, // Ensure it stays above other components
    marginBottom: 20, // Optional: to add space above the bottom bar
    paddingTop: 10, // Optional: to add some padding at the top
    paddingBottom: 10, // Optional: to add some padding at the bottom
  },
});

export default BottomBar;
