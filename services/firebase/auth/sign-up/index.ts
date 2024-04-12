import { createUserWithEmailAndPassword, UserCredential, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '@/services/firebase';
import { FirebaseError } from 'firebase/app';

const provider = new GoogleAuthProvider();

export async function signUp(email: string, password: string) {
  let result: UserCredential | null = null;
  let error: FirebaseError | null = null;

  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
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

export default signUp;
