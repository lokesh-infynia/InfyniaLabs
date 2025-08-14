import * as admin from 'firebase-admin';

// This function initializes the Firebase Admin SDK.
// It ensures that the SDK is initialized only once.
function getDb() {
  if (!admin.apps.length) {
    try {
      // Initialize the app without explicit credentials.
      // This works in environments where default credentials are not available.
      admin.initializeApp();
    } catch (e) {
      console.error('Firebase admin initialization error', e);
      throw new Error('Failed to initialize Firebase Admin SDK.');
    }
  }
  return admin.firestore();
}

export const db = getDb();
