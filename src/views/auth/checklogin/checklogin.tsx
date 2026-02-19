export const isLoggedIn = (): boolean => {
  const auth = localStorage.getItem('auth');
  if (!auth) return false;

  try {
    const LS = JSON.parse(auth);
    return !!LS.token;
  } catch (e) {
    console.error('Failed to parse auth from localStorage', e);
    return false;
  }
};
