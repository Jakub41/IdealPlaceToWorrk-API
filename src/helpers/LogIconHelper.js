const LogIconHelper = (info) => {
  if (info.level === 'info') {
    return '✌️';
  }

  if (info.level === 'error') {
    return '🔥';
  }

  return 'warning';
};

export default LogIconHelper;
