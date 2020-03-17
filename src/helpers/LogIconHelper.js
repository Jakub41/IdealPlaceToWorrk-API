// Helper to show the icons in terminal
const LogIconHelper = (info) => {
  if (info.level === 'info') {
    return '✌️';
  }

  if (info.level === 'error') {
    return '🔥';
  }

  return '⚠️';
};

export default LogIconHelper;
