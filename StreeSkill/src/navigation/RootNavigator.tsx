import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabs from './MainTabs';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import ReelPlayerScreen from '../screens/ReelPlayerScreen';
import YouTubePlayerScreen from '../screens/YouTubePlayerScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.screenBg,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={({ route }) => ({ 
          title: route.params.courseTitle,
          headerStyle: { backgroundColor: COLORS.primary },
        })}
      />
      <Stack.Screen
        name="ReelPlayer"
        component={ReelPlayerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="YouTubePlayer"
        component={YouTubePlayerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
