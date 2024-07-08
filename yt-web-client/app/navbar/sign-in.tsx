import { signInWithGoogle, signOut } from '../firebase/firebase';
import styles from './sign-in.module.css';
import { User } from 'firebase/auth';


interface SignInProps {
  user: User | null;
}

export default function SignIn({ user }: SignInProps) {

  return (
    <div>
      {user ? (
        // If user is signed in
        <button className={styles.signin} onClick={signOut}>
          Sign Out
        </button>
      ) : (
        // If user is not signed in
        <button className={styles.signin} onClick={signInWithGoogle}>
          Sign in
        </button>
      )}
    </div>
  );
}
