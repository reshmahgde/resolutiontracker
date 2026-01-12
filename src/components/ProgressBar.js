import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const ProgressBar = ({ progress, height = 8 }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.progress, { width: `${clampedProgress}%`, height }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});

export default ProgressBar;

