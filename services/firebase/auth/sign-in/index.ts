import { GoogleAuthProvider, signInWithCustomToken, signInWithEmailAndPassword, signInWithPopup, UserCredential } from 'firebase/auth';

import { auth } from '@/services/firebase';
import { FirebaseError } from 'firebase/app';

const provider = new GoogleAuthProvider();

export async function signIn(email: string, password: string) {
  let result: UserCredential | null = null;
  let error: FirebaseError | null = null;

  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (err: FirebaseError | any) {
    error = err;
  }

  return { result, error };
}

export async function signUpWithGoogle() {
  let result: UserCredential | null = null;
  let error: FirebaseError | null = null;

  try {
    result = await signInWithPopup(auth, provider);
  } catch (err : FirebaseError | any) {
    error = err;
  }

  return { result, error };
}

export async function signInWithToken(token: string) {
  let result: UserCredential | null = null;
  let error: Error | null | unknown = null;

  try {
    result = await signInWithCustomToken(auth, token);
  } catch (err) {
    error = err;
  }

  return { result, error };
}

export default signIn;
