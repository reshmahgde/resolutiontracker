import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { colors } from '../constants/colors';
import { getCategoryById } from '../constants/categories';
import {
  getAllGoals,
  logUpdate,
  getGoalUpdates,
  deleteGoal,
  updateGoal,
} from '../services/goalService';
import ProgressBar from '../components/ProgressBar';
import CelebrationModal from '../components/CelebrationModal';
import { getEncouragementMessage, checkMilestone } from '../utils/encouragement';
import { format } from 'date-fns';

const GoalDetailScreen = ({ route, navigation }) => {
  const { goalId } = route.params;
  const [goal, setGoal] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [progressInput, setProgressInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  const loadData = async () => {
    const goals = await getAllGoals();
    const foundGoal = goals.find(g => g.id === goalId);
    if (foundGoal) {
      setGoal(foundGoal);
      const goalUpdates = await getGoalUpdates(goalId);
      setUpdates(goalUpdates);
    }
  };

  useEffect(() => {
    loadData();
  }, [goalId]);

  const handleLogUpdate = async () => {
    if (!progressInput.trim()) {
      Alert.alert('Error', 'Please enter progress percentage');
      return;
    }

    const progress = parseInt(progressInput);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      Alert.alert('Error', 'Progress must be between 0 and 100');
      return;
    }

    try {
      const oldProgress = goal.progress;
      const result = await logUpdate(goalId, {
        progress,
        note: noteInput.trim(),
      });

      setGoal(result.goal);
      setProgressInput('');
      setNoteInput('');

      // Check for celebrations
      if (result.goal.status === 'achieved') {
        setCelebrationMessage(getEncouragementMessage('achievement'));
        setCelebrationVisible(true);
      } else {
        const milestone = checkMilestone(oldProgress, progress);
        if (milestone) {
          setCelebrationMessage(getEncouragementMessage('milestone', progress));
          setCelebrationVisible(true);
        } else if (progress > oldProgress) {
          setCelebrationMessage(getEncouragementMessage('progress'));
          setCelebrationVisible(true);
        }
      }

      await loadData();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal(goalId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const category = getCategoryById(goal.category);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <View style={styles.headerText}>
            <Text style={styles.title}>{goal.title}</Text>
            <Text style={styles.category}>{category.name}</Text>
          </View>
        </View>
        {goal.status === 'achieved' && (
          <View style={styles.achievedBadge}>
            <Text style={styles.achievedText}>✓ Achieved</Text>
          </View>
        )}
      </View>

      {goal.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{goal.description}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.progressHeader}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <Text style={styles.progressValue}>{goal.progress}%</Text>
        </View>
        <ProgressBar progress={goal.progress} height={16} />
        {goal.status === 'achieved' && goal.achievedAt && (
          <Text style={styles.achievedDate}>
            Achieved on {format(new Date(goal.achievedAt), 'MMMM d, yyyy')}
          </Text>
        )}
      </View>

      {goal.status === 'active' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log Update</Text>
          <TextInput
            style={styles.input}
            placeholder="Progress % (0-100)"
            value={progressInput}
            onChangeText={setProgressInput}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add a note about your progress..."
            value={noteInput}
            onChangeText={setNoteInput}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleLogUpdate}>
            <Text style={styles.updateButtonText}>Log Update</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update History</Text>
        {updates.length === 0 ? (
          <Text style={styles.emptyText}>No updates yet. Log your first update!</Text>
        ) : (
          <FlatList
            data={updates}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.updateCard}>
                <View style={styles.updateHeader}>
                  <Text style={styles.updateProgress}>{item.progress}%</Text>
                  <Text style={styles.updateDate}>
                    {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
                  </Text>
                </View>
                {item.note ? (
                  <Text style={styles.updateNote}>{item.note}</Text>
                ) : null}
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Goal</Text>
      </TouchableOpacity>

      <CelebrationModal
        visible={celebrationVisible}
        message={celebrationMessage}
        onClose={() => setCelebrationVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: 20,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  achievedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  achievedText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 12,
  },
  section: {
    backgroundColor: colors.surface,
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  achievedDate: {
    fontSize: 14,
    color: colors.success,
    marginTop: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    paddingTop: 16,
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  updateCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateProgress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  updateDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  updateNote: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    margin: 20,
    marginTop: 12,
  },
  deleteButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GoalDetailScreen;

