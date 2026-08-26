import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';
import { getUserProfile } from './usersService';
import { User, UserRole } from '../types/user';

export interface AuthorityUser extends User {
  firebaseUid: string;
}

export async function loginWithEmail(email: string, password: string): Promise<AuthorityUser> {
  // If Firebase is configured with real keys, authenticate via Firebase Auth
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    // Fetch user details from Firestore users collection if present
    const profile = await getUserProfile(fbUser.uid);

    let role: UserRole = 'sachiv';
    if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('bdo')) {
      role = 'admin';
    } else if (email.toLowerCase().includes('pradhan')) {
      role = 'pradhan';
    } else if (profile?.role) {
      role = profile.role as UserRole;
    }

    const authUser: AuthorityUser = {
      id: fbUser.uid,
      firebaseUid: fbUser.uid,
      email: fbUser.email || email,
      name: profile?.name || (role === 'pradhan' ? 'Gram Pradhan (Rampur)' : role === 'sachiv' ? 'Panchayat Sachiv' : 'District Grievance Officer'),
      role: role,
      village: profile?.village || 'Rampur Gram Panchayat',
      ward: profile?.ward || 'All Wards',
      designation: role === 'pradhan' ? 'Elected Village Head' : role === 'sachiv' ? 'Panchayat Secretary' : 'Block Grievance Officer',
    };

    return authUser;
  } catch (error: any) {
    // If Firebase Auth throws user-not-found / invalid credential, check if this is an official authority preset
    // and try registering or logging into demo session
    console.warn('Firebase Auth standard login attempt failed:', error.code, error.message);
    
    // If user attempted standard official authority credentials, allow fallback authority session for presentation/demo
    if (
      (email === 'sachiv@gramsetu.in' && password === 'Sachiv@123') ||
      (email === 'pradhan@gramsetu.in' && password === 'Pradhan@123') ||
      (email === 'admin@gramsetu.in' && password === 'Admin@123')
    ) {
      const isPradhan = email.includes('pradhan');
      const isSachiv = email.includes('sachiv');
      const role: UserRole = isPradhan ? 'pradhan' : isSachiv ? 'sachiv' : 'admin';

      const fallbackUser: AuthorityUser = {
        id: `demo-${role}-uid`,
        firebaseUid: `demo-${role}-uid`,
        email: email,
        name: isPradhan ? 'Shri Ramswaroop Yadav (Gram Pradhan)' : isSachiv ? 'Pankaj Sharma (Panchayat Sachiv)' : 'Anurag Verma (BDO / Admin)',
        role: role,
        village: 'Rampur Gram Panchayat',
        ward: 'All Wards',
        designation: isPradhan ? 'Elected Village Head' : isSachiv ? 'Panchayat Secretary' : 'Block Grievance Officer',
      };
      return fallbackUser;
    }

    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Signout error:', err);
  }
}
