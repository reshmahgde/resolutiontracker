import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors } from '../constants/colors';
import { generateYearReport, getAllGoals } from '../services/goalService';
import { getAllYears, getCurrentYear } from '../services/storage';
import ProgressBar from '../components/ProgressBar';
import { format } from 'date-fns';

const ReportScreen = ({ navigation }) => {
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [years, setYears] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadYears = async () => {
    const allYears = await getAllYears();
    const currentYear = getCurrentYear();
    if (allYears.length > 0) {
      // Ensure current year is included
      const uniqueYears = [...new Set([...allYears, currentYear])].sort((a, b) => b - a);
      setYears(uniqueYears);
      setSelectedYear(uniqueYears[0]);
    } else {
      setYears([currentYear]);
      setSelectedYear(currentYear);
    }
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      const yearReport = await generateYearReport(selectedYear);
      setReport(yearReport);
    } catch (error) {
      console.error('Error loading report:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      loadReport();
    }
  }, [selectedYear]);

  if (loading || !report) {
    return (
      <View style={styles.container}>
        <Text>Loading report...</Text>
      </View>
    );
  }

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Year Report</Text>
        <View style={styles.yearSelector}>
          {years.map(year => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearButton,
                selectedYear === year && styles.yearButtonActive,
              ]}
              onPress={() => setSelectedYear(year)}
            >
              <Text
                style={[
                  styles.yearButtonText,
                  selectedYear === year && styles.yearButtonTextActive,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{report.totalGoals}</Text>
            <Text style={styles.summaryLabel}>Total Goals</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{report.activeGoals}</Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{report.achievedGoals}</Text>
            <Text style={styles.summaryLabel}>Achieved</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{report.averageProgress}%</Text>
            <Text style={styles.summaryLabel}>Avg Progress</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Overview</Text>
        <Text style={styles.activityText}>
          Total Updates: {report.totalUpdates}
        </Text>
        <View style={styles.monthChart}>
          {monthNames.map((month, index) => {
            const count = report.updatesByMonth[index] || 0;
            const maxCount = Math.max(...Object.values(report.updatesByMonth), 1);
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            return (
              <View key={index} style={styles.monthBar}>
                <View style={[styles.bar, { height: `${height}%` }]} />
                <Text style={styles.monthLabel}>{month}</Text>
                {count > 0 && (
                  <Text style={styles.monthCount}>{count}</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Goals</Text>
        {report.goals.length === 0 ? (
          <Text style={styles.emptyText}>No goals for this year</Text>
        ) : (
          <FlatList
            data={report.goals}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.goalItem}>
                <View style={styles.goalItemHeader}>
                  <Text style={styles.goalItemTitle}>{item.title}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === 'achieved'
                        ? styles.statusBadgeAchieved
                        : styles.statusBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        item.status === 'achieved'
                          ? styles.statusTextAchieved
                          : styles.statusTextActive,
                      ]}
                    >
                      {item.status === 'achieved' ? '✓ Achieved' : 'Active'}
                    </Text>
                  </View>
                </View>
                <View style={styles.goalItemProgress}>
                  <ProgressBar progress={item.progress} height={8} />
                  <Text style={styles.goalItemProgressText}>{item.progress}%</Text>
                </View>
                {item.achievedAt && (
                  <Text style={styles.goalItemDate}>
                    Achieved: {format(new Date(item.achievedAt), 'MMM d, yyyy')}
                  </Text>
                )}
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  yearSelector: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  yearButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  yearButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  yearButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  yearButtonTextActive: {
    color: colors.surface,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    margin: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.surface,
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  activityText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
  },
  monthChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: 8,
  },
  monthBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  bar: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
    minHeight: 4,
  },
  monthLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  monthCount: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  goalItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  goalItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  statusBadgeAchieved: {
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusTextActive: {
    color: colors.primary,
  },
  statusTextAchieved: {
    color: colors.surface,
  },
  goalItemProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalItemProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 12,
    minWidth: 45,
  },
  goalItemDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});

export default ReportScreen;

