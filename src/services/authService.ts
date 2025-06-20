import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebaseConfig';

export interface SignInCredentials {
    email: string;
    password: string;
}

export const signInUser = async ({email, password}: SignInCredentials): Promise<void> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error signing in user:", error);
        throw error;
    }
};
