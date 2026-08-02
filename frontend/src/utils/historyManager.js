const STORAGE_KEY = 'brandsphere_history';

export const getHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getMockHistory();
  } catch (error) {
    console.error("Failed to load history", error);
    return getMockHistory();
  }
};

export const saveHistoryEvent = (event) => {
  try {
    const currentHistory = getHistory();
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newEvent, ...currentHistory];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error("Failed to save history event", error);
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Seed initial history so the dashboard looks great for the demo immediately
const getMockHistory = () => {
  return [
    {
      id: 'mock-1',
      title: 'Q4 Product Launch Advertisement',
      type: 'Advertisement',
      score: 94,
      status: 'Safe to Publish',
      editor: 'Jane D.',
      isAiFixed: true,
      company: 'Acme Corporation',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: 'mock-2',
      title: 'Instagram Story — Summer Campaign',
      type: 'Social Media',
      score: 78,
      status: 'Needs Review',
      editor: 'AI Auto',
      isAiFixed: false,
      company: 'Acme Corporation',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: 'mock-3',
      title: 'Email Newsletter — July Edition',
      type: 'Email',
      score: 88,
      status: 'Safe to Publish',
      editor: 'Mark T.',
      isAiFixed: true,
      company: 'Acme Corporation',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    },
    {
      id: 'mock-4',
      title: 'Website Hero Section Copy',
      type: 'Website',
      score: 62,
      status: 'High Risk',
      editor: 'Lisa K.',
      isAiFixed: false,
      company: 'Acme Corporation',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
    }
  ];
};
