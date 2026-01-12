export const categories = [
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#ef4444' },
  { id: 'career', name: 'Career', icon: '💼', color: '#3b82f6' },
  { id: 'education', name: 'Education', icon: '📚', color: '#8b5cf6' },
  { id: 'finance', name: 'Finance', icon: '💰', color: '#10b981' },
  { id: 'relationships', name: 'Relationships', icon: '❤️', color: '#f472b6' },
  { id: 'hobbies', name: 'Hobbies', icon: '🎨', color: '#f59e0b' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#06b6d4' },
  { id: 'personal', name: 'Personal Growth', icon: '🌟', color: '#6366f1' },
  { id: 'general', name: 'General', icon: '📝', color: '#6b7280' },
];

export const getCategoryById = (id) => {
  return categories.find(c => c.id === id) || categories[categories.length - 1];
};

