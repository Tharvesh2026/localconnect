import {initializeApp, getApps, getApp, FirebaseApp} from 'firebase/app';
import {getFirestore, Firestore} from 'firebase/firestore';
import {getAuth, Auth} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDsaTGGXrxGAcw69ZYKB8XuPC3qO0Gf7bw",
  authDomain: "thrivepulse.firebaseapp.com",
  projectId: "thrivepulse",
  storageBucket: "thrivepulse.firebasestorage.app",
  messagingSenderId: "437182397315",
  appId: "1:437182397315:web:a735f022e34d5b508754b6"
};

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return appInstance;
}

export function getDb(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp());
  }
  return firestoreInstance;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }
  return authInstance;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function formatFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): string {
  const rawMsg = error instanceof Error ? error.message : String(error);
  let authInfo: FirestoreErrorInfo['authInfo'] = {};
  try {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    authInfo = {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    };
  } catch {
    // Auth might not be initialized or SSR environment
  }

  const errInfo: FirestoreErrorInfo = {
    error: rawMsg,
    authInfo,
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));

  if (rawMsg.includes('offline') || rawMsg.includes('unavailable') || rawMsg.includes('network')) {
    return 'Database is currently offline or unreachable. Please check your internet connection.';
  }
  if (rawMsg.includes('permission-denied') || rawMsg.includes('Missing or insufficient permissions')) {
    return 'Database permission denied. Please verify rules and access permissions.';
  }
  return rawMsg || 'An error occurred while connecting to Firestore.';
}

