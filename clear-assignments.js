Object.keys(localStorage).filter(key => key.startsWith('assignments-')).forEach(key => localStorage.removeItem(key));
