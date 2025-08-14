import * as admin from 'firebase-admin';

// This function initializes the Firebase Admin SDK.
// It checks if the app is already initialized to prevent errors.
// It's configured to work in different environments by checking for process.env.FUNCTIONS_EMULATOR.
function getDb() {
  if (!admin.apps.length) {
    try {
      // When running in a local emulator, we don't need to provide credentials.
      if (process.env.FUNCTIONS_EMULATOR) {
         admin.initializeApp();
      } else {
         admin.initializeApp({
            credential: admin.credential.applicationDefault(),
         });
      }
    } catch (e) {
      console.error('Firebase admin initialization error', e);
      throw new Error('Failed to initialize Firebase Admin SDK.');
    }
  }
  return admin.firestore();
}

export const db = getDb();
