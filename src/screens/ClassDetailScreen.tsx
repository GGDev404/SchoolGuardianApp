import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../contexts/AppContexts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useScreenStyles } from '../hooks/useStyles';

const defaultSchedule = [
  { day: 'Monday', time: '8:00 AM - 9:30 AM' },
  { day: 'Wednesday', time: '8:00 AM - 9:30 AM' },
  { day: 'Friday', time: '8:00 AM - 9:30 AM' },
];

const ClassDetailScreen = ({ route, navigation }: any) => {
  const { theme } = React.useContext(ThemeContext);
  const { colors, styles, common } = useScreenStyles('home');
  const { classInfo } = route.params;
  const schedule = classInfo.schedule || defaultSchedule;
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "top"]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: insets.top + 18,
          left: 18,
          zIndex: 10,
          backgroundColor: colors.card,
          borderRadius: 20,
          padding: 6,
          elevation: 4,
        }}
      >
        <Ionicons name="arrow-back" size={26} color={colors.text} />
      </TouchableOpacity>
      <Image 
        source={{ uri: classInfo.image }} 
        style={{
          width: '100%',
          height: 300,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          resizeMode: 'cover',
          borderRadius: 16,
        }} 
      />
      <ScrollView 
        style={[{
          flex: 1,
          padding: 24,
          marginTop: -16,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }, { backgroundColor: colors.card }]} 
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Text style={[common.title, { color: colors.text, fontSize: 26 }]}>{classInfo.name || 'Advanced Mathematics'}</Text>
        <Text style={[common.subtitle, { color: colors.textSecondary, fontSize: 16, marginBottom: 24 }]}>{classInfo.room || 'Room 201, Science Building'}</Text>
        <Text style={[common.sectionTitle, { color: colors.text }]}>{'Schedule'}</Text>
        {schedule.map((item: any, idx: number) => (
          <View key={idx} style={[common.card, { 
            backgroundColor: colors.input,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 18
          }]}> 
            <Ionicons name="calendar-outline" size={32} color={colors.button} style={{ marginRight: 16 }} />
            <View>
              <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 17, marginBottom: 2 }}>{item.day}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 15 }}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClassDetailScreen;
