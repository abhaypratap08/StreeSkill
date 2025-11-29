import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/theme';
import { authApi } from '../services/api';
import { trackEvent } from '../hooks/useApi';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

const { height } = Dimensions.get('window');

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    if (!username.trim() || username.length < 2) {
      Alert.alert('Error', 'Please enter a valid username');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await authApi.register({ email: email.trim(), password, name: username.trim() });
      if (result.success) {
        trackEvent('signup', { method: 'email' });
        Alert.alert('Welcome!', 'Account created successfully', [
          { text: 'OK', onPress: () => navigation.replace('Main') }
        ]);
      } else {
        Alert.alert('Sign Up Failed', result.error || 'Could not create account');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.decorativeCircle} />
          <View style={styles.decorativeLine} />
          <Text style={styles.title}>
            <Text style={styles.titleLight}>SIGN</Text>
            <Text style={styles.titleBold}>UP</Text>
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.screenBg} />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: height * 0.25,
    justifyContent: 'flex-end',
    paddingBottom: 30,
    paddingHorizontal: 30,
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: COLORS.accent,
    opacity: 0.3,
  },
  decorativeLine: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 120,
    height: 2,
    backgroundColor: COLORS.accent,
    opacity: 0.3,
    transform: [{ rotate: '-30deg' }],
  },
  title: {
    fontSize: 32,
  },
  titleLight: {
    color: COLORS.screenBg,
    fontWeight: '300',
  },
  titleBold: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: COLORS.screenBg,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.darkGray,
  },
  signupButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: COLORS.screenBg,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 30,
  },
  footerText: {
    color: COLORS.screenBg,
    fontSize: 12,
    opacity: 0.8,
  },
  footerLink: {
    color: COLORS.screenBg,
    fontSize: 12,
    fontWeight: '600',
  },
});
