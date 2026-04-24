import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let cachedDb: Firestore | null = null;

export const getDb = () => {
  if (cachedDb) {
    return cachedDb;
  }

  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!rawKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set');
  }

  const serviceAccount = JSON.parse(rawKey);

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount)
    });
  }

  cachedDb = getFirestore();
  return cachedDb;
};
