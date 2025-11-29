import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Decorative circles */}
      <View style={styles.circleContainer}>
        <View style={[styles.circle, styles.circleLarge]} />
        <View style={[styles.circle, styles.circleSmall]} />
      </View>
      
      {/* Bottom wave shape */}
      <View style={styles.bottomWave}>
        <Text style={styles.nextText}>Next</Text>
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
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    backgroundColor: COLORS.screenBg,
    borderRadius: 1000,
  },
  circleLarge: {
    width: width * 0.8,
    height: width * 0.8,
    top: height * 0.15,
    left: -width * 0.2,
  },
  circleSmall: {
    width: width * 0.4,
    height: width * 0.4,
    top: height * 0.08,
    right: width * 0.1,
  },
  bottomWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.screenBg,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
