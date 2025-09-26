export interface User {
  email: string;
  password: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  bio?: string;
  profileCompleted?: boolean;
}

// User management
export const saveUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('projectKepler_user', JSON.stringify(user));
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('projectKepler_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const updateUser = (updates: Partial<User>): void => {
  const currentUser = getUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates };
    saveUser(updatedUser);
  }
};

export const isLoggedIn = (): boolean => {
  return getUser() !== null;
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('projectKepler_user');
  }
};

// Check if user exists by email
export const userExists = (email: string): boolean => {
  const user = getUser();
  return user?.email === email;
};

// Validate login credentials
export const validateLogin = (email: string, password: string): boolean => {
  const user = getUser();
  return user?.email === email && user?.password === password;
};