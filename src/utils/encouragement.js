const ENCOURAGEMENT_MESSAGES = {
  progress: [
    "🎉 Great progress! Keep it up!",
    "💪 You're doing amazing!",
    "🌟 Every step counts!",
    "✨ You're on the right track!",
    "🚀 Keep pushing forward!",
    "💯 You've got this!",
    "🎯 Making great strides!",
    "⭐ Progress looks fantastic!",
  ],
  achievement: [
    "🏆 Congratulations! You did it!",
    "🎊 Goal achieved! You're incredible!",
    "🌟 Amazing work! You reached your goal!",
    "💫 You're unstoppable! Goal completed!",
    "🎉 Fantastic! Another goal conquered!",
    "✨ Outstanding achievement!",
    "🔥 You're on fire! Goal accomplished!",
    "💎 Perfect! You nailed it!",
  ],
  milestone: [
    "🎯 25% complete! You're a quarter of the way there!",
    "🎯 50% complete! Halfway there!",
    "🎯 75% complete! Almost there!",
    "🎯 90% complete! So close to the finish line!",
  ],
};

export const getEncouragementMessage = (type, progress = 0) => {
  if (type === 'achievement') {
    return ENCOURAGEMENT_MESSAGES.achievement[
      Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.achievement.length)
    ];
  }
  
  if (type === 'milestone') {
    if (progress >= 90) {
      return ENCOURAGEMENT_MESSAGES.milestone[3];
    } else if (progress >= 75) {
      return ENCOURAGEMENT_MESSAGES.milestone[2];
    } else if (progress >= 50) {
      return ENCOURAGEMENT_MESSAGES.milestone[1];
    } else if (progress >= 25) {
      return ENCOURAGEMENT_MESSAGES.milestone[0];
    }
  }
  
  return ENCOURAGEMENT_MESSAGES.progress[
    Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.progress.length)
  ];
};

export const checkMilestone = (oldProgress, newProgress) => {
  const milestones = [25, 50, 75, 90];
  const crossedMilestone = milestones.find(m => oldProgress < m && newProgress >= m);
  return crossedMilestone ? newProgress : null;
};

