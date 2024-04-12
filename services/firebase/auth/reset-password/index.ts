import { sendPasswordResetEmail } from 'firebase/auth';

import { auth } from '@/services/firebase';

export async function resetPassword({
  email,
  url = 'https://empresas.intrare.mx',
}: {
  email: string;
  url?: string;
}) {
  let error: Error | null | unknown = null;

  try {
    await sendPasswordResetEmail(auth, email, {
      url,
    });
  } catch (err) {
    error = err;
  }

  return { error };
}

export default resetPassword;
