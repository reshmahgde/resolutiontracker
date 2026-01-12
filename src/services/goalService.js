import { getGoalsForYear, saveGoalsForYear, getUpdatesForYear, saveUpdatesForYear, getCurrentYear } from './storage';

const MAX_ACTIVE_GOALS = 150;

export const createGoal = async (goalData) => {
  const year = getCurrentYear();
  const goals = await getGoalsForYear(year);
  
  const activeGoals = goals.filter(g => g.status === 'active');
  if (activeGoals.length >= MAX_ACTIVE_GOALS) {
    throw new Error(`Maximum ${MAX_ACTIVE_GOALS} active goals allowed per year`);
  }

  const newGoal = {
    id: Date.now().toString(),
    title: goalData.title,
    description: goalData.description || '',
    category: goalData.category || 'general',
    targetDate: goalData.targetDate || null,
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    year: year,
  };

  goals.push(newGoal);
  await saveGoalsForYear(year, goals);
  return newGoal;
};

export const updateGoal = async (goalId, updates) => {
  const year = getCurrentYear();
  const goals = await getGoalsForYear(year);
  
  const index = goals.findIndex(g => g.id === goalId);
  if (index === -1) {
    throw new Error('Goal not found');
  }

  goals[index] = {
    ...goals[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await saveGoalsForYear(year, goals);
  return goals[index];
};

export const deleteGoal = async (goalId) => {
  const year = getCurrentYear();
  const goals = await getGoalsForYear(year);
  
  const filteredGoals = goals.filter(g => g.id !== goalId);
  await saveGoalsForYear(year, filteredGoals);
  return true;
};

export const getActiveGoals = async () => {
  const year = getCurrentYear();
  const goals = await getGoalsForYear(year);
  return goals.filter(g => g.status === 'active');
};

export const getAllGoals = async (year = null) => {
  const targetYear = year || getCurrentYear();
  return await getGoalsForYear(targetYear);
};

export const logUpdate = async (goalId, updateData) => {
  const year = getCurrentYear();
  const goals = await getGoalsForYear(year);
  const updates = await getUpdatesForYear(year);
  
  const goal = goals.find(g => g.id === goalId);
  if (!goal) {
    throw new Error('Goal not found');
  }

  const newUpdate = {
    id: Date.now().toString(),
    goalId: goalId,
    goalTitle: goal.title,
    note: updateData.note || '',
    progress: updateData.progress || 0,
    timestamp: new Date().toISOString(),
  };

  updates.push(newUpdate);

  // Update goal progress
  const goalIndex = goals.findIndex(g => g.id === goalId);
  if (goalIndex !== -1) {
    const newProgress = Math.min(100, Math.max(0, updateData.progress || goal.progress));
    goals[goalIndex].progress = newProgress;
    
    // Check if goal is achieved
    if (newProgress >= 100 && goals[goalIndex].status === 'active') {
      goals[goalIndex].status = 'achieved';
      goals[goalIndex].achievedAt = new Date().toISOString();
    }
    
    goals[goalIndex].updatedAt = new Date().toISOString();
  }

  await saveUpdatesForYear(year, updates);
  await saveGoalsForYear(year, goals);
  
  return { update: newUpdate, goal: goals[goalIndex] };
};

export const getGoalUpdates = async (goalId) => {
  const year = getCurrentYear();
  const updates = await getUpdatesForYear(year);
  return updates.filter(u => u.goalId === goalId).sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
};

export const getAllUpdates = async (year = null) => {
  const targetYear = year || getCurrentYear();
  return await getUpdatesForYear(targetYear);
};

export const generateYearReport = async (year) => {
  const goals = await getGoalsForYear(year);
  const updates = await getUpdatesForYear(year);
  
  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const achievedGoals = goals.filter(g => g.status === 'achieved').length;
  const averageProgress = goals.length > 0
    ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
    : 0;
  
  const totalUpdates = updates.length;
  const updatesByMonth = {};
  
  updates.forEach(update => {
    const month = new Date(update.timestamp).getMonth();
    updatesByMonth[month] = (updatesByMonth[month] || 0) + 1;
  });

  return {
    year,
    totalGoals,
    activeGoals,
    achievedGoals,
    averageProgress: Math.round(averageProgress),
    totalUpdates,
    updatesByMonth,
    goals: goals.map(g => ({
      id: g.id,
      title: g.title,
      status: g.status,
      progress: g.progress,
      createdAt: g.createdAt,
      achievedAt: g.achievedAt,
    })),
  };
};

