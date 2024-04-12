import { signOut as firebaseSignOut } from 'firebase/auth';

import { auth } from '@/services/firebase';

export async function signOut() {
  let error: Error | boolean | unknown = false;

  try {
    await firebaseSignOut(auth);
  } catch (err) {
    error = err;
  }

  return { error };
}

export default signOut;
