import * as admin from 'firebase-admin';

function getDb() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } catch (e) {
      console.error('Firebase admin initialization error', e);
      // Depending on the environment, you might want to handle this differently.
      // For now, we'll rethrow to make it clear initialization failed.
      throw new Error('Failed to initialize Firebase Admin SDK.');
    }
  }
  return admin.firestore();
}

export const db = getDb();
