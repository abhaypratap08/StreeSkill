import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './types';
import DashboardScreen from '../screens/DashboardScreen';
import SellScreen from '../screens/SellScreen';
import CommunityScreen from '../screens/CommunityScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const getTabIcon = (name: string) => {
  switch (name) {
    case 'Dashboard': return '🏠';
    case 'Community': return '💬';
    case 'Sell': return '💰';
    default: return '📱';
  }
};

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <View style={{ alignItems: 'center', paddingTop: 8 }}>
    <Text style={{ fontSize: 22 }}>{getTabIcon(name)}</Text>
    <Text style={{ 
      fontSize: 10, 
      color: focused ? COLORS.white : COLORS.white,
      fontWeight: focused ? 'bold' : 'normal',
      marginTop: 2,
      opacity: focused ? 1 : 0.7,
    }}>
      {name}
    </Text>
  </View>
);

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.white,
        tabBarStyle: {
          backgroundColor: COLORS.primary, // #FF6B6B saffron orange
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 8,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
          elevation: 0,
        },
        headerStyle: { 
          backgroundColor: COLORS.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'StreeSkill',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="Dashboard" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          title: 'Community',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          tabBarIcon: ({ focused }) => <TabIcon name="Community" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Sell"
        component={SellScreen}
        options={{
          title: 'List on Meesho',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          tabBarIcon: ({ focused }) => <TabIcon name="Sell" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
}
