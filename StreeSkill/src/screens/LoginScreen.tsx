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
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await authApi.login({ email: email.trim(), password });
      if (result.success) {
        trackEvent('login', { method: 'email' });
        navigation.replace('Main');
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your email address first');
      return;
    }
    setLoading(true);
    try {
      const result = await authApi.forgotPassword(email.trim());
      if (result.success) {
        Alert.alert('Success', 'Password reset link sent to your email');
      } else {
        Alert.alert('Error', result.error || 'Could not send reset email');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
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
        {/* Header with decorative elements */}
        <View style={styles.header}>
          <View style={styles.decorativeCircle} />
          <View style={styles.decorativeLine} />
          <Text style={styles.title}>
            <Text style={styles.titleLight}>LOG</Text>
            <Text style={styles.titleBold}>IN</Text>
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter Username or Email</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter password</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.screenBg} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Not registered yet? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    height: height * 0.35,
    borderBottomLeftRadius: 60,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 30,
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.accent,
    opacity: 0.3,
  },
  decorativeLine: {
    position: 'absolute',
    top: 80,
    left: 20,
    width: 150,
    height: 2,
    backgroundColor: COLORS.accent,
    opacity: 0.3,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: 32,
  },
  titleLight: {
    color: COLORS.screenBg,
    fontWeight: '300',
  },
  titleBold: {
    color: COLORS.screenBg,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: COLORS.screenBg,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
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
    color: COLORS.gray,
    fontSize: 12,
  },
  footerLink: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
