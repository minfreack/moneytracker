import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = JSON.parse(String(process.env.NEXT_PUBLIC_FIREBASE_CONFIG));

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

const getToken = async () => {
  const dataToken = await auth.currentUser?.getIdTokenResult();
  return dataToken?.token;
};

export { auth, db, getToken, storage };
