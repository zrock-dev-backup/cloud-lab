import { ref, get, set, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import type { User } from 'firebase/auth';

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    address: string;
    birthDate: string;
}

export const createUserProfileDocument = async (user: User, additionalData: Partial<UserProfile> = {}) => {
    if (!user) return;

    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
        const { displayName, email } = user;
        const createdAt = new Date().toISOString();
        try {
            await set(userRef, {
                name: displayName || additionalData.name || '',
                email: email || '',
                createdAt,
                address: additionalData.address || '',
                birthDate: additionalData.birthDate || '',
                ...additionalData,
            });
        } catch (error) {
            console.error("Error creating user profile document:", error);
        }
    }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        return { uid, ...snapshot.val() } as UserProfile;
    } else {
        console.log("No such user data!");
        return null;
    }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    const userRef = ref(db, `users/${uid}`);
    await update(userRef, data);
};
