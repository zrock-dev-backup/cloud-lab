import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
}

export const createUserProfileDocument = async (
  user: User,
  additionalData: Partial<UserProfile> = {},
) => {
  if (!user) return;

  const userRef = doc(db, `users/${user.uid}`);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email } = user;
    try {
      await setDoc(userRef, {
        name: displayName || additionalData.name || "",
        email: email || "",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating user profile document:", error);
      throw error;
    }
  }
};

export const getUserProfile = async (
  uid: string,
): Promise<UserProfile | null> => {
  const userRef = doc(db, `users/${uid}`);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return { uid, ...snapshot.data() } as UserProfile;
  } else {
    console.warn("No such user profile!");
    return null;
  }
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>,
) => {
  const userRef = doc(db, `users/${uid}`);
  await updateDoc(userRef, data);
};
