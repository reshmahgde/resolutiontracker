import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { getCategoryById } from '../constants/categories';
import ProgressBar from './ProgressBar';

const GoalCard = ({ goal, onPress }) => {
  const category = getCategoryById(goal.category);
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>{goal.title}</Text>
          <Text style={styles.category}>{category.name}</Text>
        </View>
        {goal.status === 'achieved' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓</Text>
          </View>
        )}
      </View>
      
      {goal.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {goal.description}
        </Text>
      ) : null}
      
      <View style={styles.progressContainer}>
        <ProgressBar progress={goal.progress} />
        <Text style={styles.progressText}>{goal.progress}%</Text>
      </View>
      
      {goal.status === 'achieved' && goal.achievedAt && (
        <Text style={styles.achievedDate}>
          Achieved on {new Date(goal.achievedAt).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 36,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 12,
    minWidth: 45,
  },
  achievedDate: {
    fontSize: 12,
    color: colors.success,
    marginTop: 8,
    fontWeight: '500',
  },
});

export default GoalCard;

