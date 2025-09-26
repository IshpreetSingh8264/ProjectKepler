import { 
  doc, 
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseClient';

export interface ApiKey {
  id: string;
  userId: string;
  keyName: string;
  hashedKey: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

// Generate a secure API key
export const generateApiKey = (): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const prefix = 'pk_';
  const keyLength = 32;
  
  let result = prefix;
  for (let i = 0; i < keyLength; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return result;
};

// Hash API key using Web Crypto API
export const hashApiKey = async (apiKey: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Create new API key for user
export const createApiKey = async (userId: string, keyName: string): Promise<{ apiKey: string; keyId: string }> => {
  try {
    const apiKey = generateApiKey();
    const hashedKey = await hashApiKey(apiKey);
    
    const apiKeyData = {
      userId,
      keyName,
      hashedKey,
      isActive: true,
      createdAt: serverTimestamp(),
      usageCount: 0,
    };

    const docRef = await addDoc(collection(db, 'apiKeys'), apiKeyData);
    
    return { apiKey, keyId: docRef.id };
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

// Get all API keys for a user (without revealing the actual keys)
export const getUserApiKeys = async (userId: string): Promise<Omit<ApiKey, 'hashedKey'>[]> => {
  try {
    const apiKeysRef = collection(db, 'apiKeys');
    const q = query(apiKeysRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        keyName: data.keyName,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastUsed: data.lastUsed?.toDate(),
        usageCount: data.usageCount || 0,
      };
    });
  } catch (error) {
    console.error('Error getting user API keys:', error);
    throw error;
  }
};

// Verify API key (for backend use)
export const verifyApiKey = async (apiKey: string): Promise<{ isValid: boolean; userId?: string; keyId?: string }> => {
  try {
    const hashedKey = await hashApiKey(apiKey);
    const apiKeysRef = collection(db, 'apiKeys');
    const q = query(
      apiKeysRef, 
      where('hashedKey', '==', hashedKey),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { isValid: false };
    }
    
    const keyDoc = querySnapshot.docs[0];
    const keyData = keyDoc.data();
    
    // Update last used timestamp and usage count
    await updateDoc(keyDoc.ref, {
      lastUsed: serverTimestamp(),
      usageCount: (keyData.usageCount || 0) + 1,
    });
    
    return { 
      isValid: true, 
      userId: keyData.userId,
      keyId: keyDoc.id 
    };
  } catch (error) {
    console.error('Error verifying API key:', error);
    return { isValid: false };
  }
};

// Deactivate API key
export const deactivateApiKey = async (keyId: string, userId: string): Promise<void> => {
  try {
    const keyRef = doc(db, 'apiKeys', keyId);
    await updateDoc(keyRef, {
      isActive: false,
    });
  } catch (error) {
    console.error('Error deactivating API key:', error);
    throw error;
  }
};

// Delete API key
export const deleteApiKey = async (keyId: string, userId: string): Promise<void> => {
  try {
    const keyRef = doc(db, 'apiKeys', keyId);
    await deleteDoc(keyRef);
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
};