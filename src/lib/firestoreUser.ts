import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { 
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  linkWithCredential,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from './firebaseClient';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  username?: string;
  bio?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  hasPassword?: boolean; // For Google users who haven't set a password
  createdAt: Date;
  updatedAt: Date;
}

// Create or update user profile in Firestore
export const createUserProfile = async (user: FirebaseUser, additionalData?: Partial<UserProfile>): Promise<void> => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { email, displayName } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        uid: user.uid,
        email,
        displayName,
        username: displayName || email?.split('@')[0] || '',
        hasPassword: user.providerData.some(provider => provider.providerId === 'password'),
        createdAt,
        updatedAt: createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile in Firestore
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Check if username is available
export const isUsernameAvailable = async (username: string, currentUid?: string): Promise<boolean> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return true;

    // If current user is using this username, it's available for them
    if (currentUid) {
      const existingUser = querySnapshot.docs[0];
      return existingUser.id === currentUid;
    }

    return false;
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw error;
  }
};

// Update password for email/password users
export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No authenticated user found');
  }

  try {
    // Re-authenticate user before password change
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await firebaseUpdatePassword(user, newPassword);
    
    // Update hasPassword flag in Firestore
    await updateUserProfile(user.uid, { hasPassword: true });
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Set password for Google users
export const setPasswordForGoogleUser = async (password: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No authenticated user found');
  }

  try {
    // Create email/password credential
    const credential = EmailAuthProvider.credential(user.email, password);
    
    // Link the credential to the existing account
    await linkWithCredential(user, credential);
    
    // Update hasPassword flag in Firestore
    await updateUserProfile(user.uid, { hasPassword: true });
  } catch (error) {
    console.error('Error setting password for Google user:', error);
    throw error;
  }
};