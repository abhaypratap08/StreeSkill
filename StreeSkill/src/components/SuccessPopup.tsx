import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SuccessPopup({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.iconCircle}>
            <Text style={styles.emoji}>🎉</Text>
          </View>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.amount}>₹300 earned!</Text>
          <Text style={styles.message}>
            Your product has been listed on Meesho successfully!
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 86, 83, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: COLORS.screenBg,
    borderRadius: SIZES.cardRadius,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 32,
    width: '85%',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: COLORS.screenBg,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
