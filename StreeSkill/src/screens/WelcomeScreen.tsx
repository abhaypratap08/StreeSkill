import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Decorative circle */}
      <View style={styles.circleContainer}>
        <View style={styles.circleLarge} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signupButton} 
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signupButtonText}>SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleLarge: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: COLORS.screenBg,
    borderRadius: width * 0.35,
    marginTop: -height * 0.1,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: height * 0.15,
    gap: 16,
  },
  loginButton: {
    backgroundColor: COLORS.screenBg,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  loginButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.screenBg,
  },
  signupButtonText: {
    color: COLORS.screenBg,
    fontSize: 16,
    fontWeight: '600',
  },
});
