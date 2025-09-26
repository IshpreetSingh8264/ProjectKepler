// Debug utility - run this in browser console to clear localStorage
// localStorage.removeItem('projectKepler_user');
// location.reload();

// Or add this as a temporary button to clear storage
export const clearUserData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('projectKepler_user');
    window.location.reload();
  }
};