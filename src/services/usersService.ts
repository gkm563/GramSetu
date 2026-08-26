import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from '../types/user';

const USERS_COLLECTION = 'users';

/**
 * Subscribe to all registered users (officers, workers, citizens)
 */
export function subscribeToUsers(
  onData: (users: User[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, USERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: User[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            name: data.name || data.fullName || 'User',
            phone: data.phone || data.phoneNumber || '',
            email: data.email || '',
            role: data.role || 'citizen',
            village: data.village || '',
            ward: data.ward || '',
            profileImage: data.profileImage || '',
            designation: data.designation || '',
            createdAt: data.createdAt,
          });
        });
        onData(list);
      },
      (err) => {
        console.error('Error in users listener:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Fetch a single user profile by UID
 */
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      name: data.name || data.fullName || 'User',
      phone: data.phone || '',
      email: data.email || '',
      role: data.role || 'citizen',
      village: data.village || '',
      ward: data.ward || '',
      profileImage: data.profileImage || '',
      designation: data.designation || '',
      createdAt: data.createdAt,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}
