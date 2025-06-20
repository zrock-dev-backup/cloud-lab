import { ref, get, set, push, serverTimestamp } from 'firebase/database';
import { db, auth } from '../firebaseConfig';

export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    text: string;
    publicId: string;
    createdAt: object;
}

export interface NewPostData {
    text: string;
    publicId: string;
}

export const createPost = async (postData: NewPostData): Promise<void> => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated.");

    const postsRef = ref(db, 'posts');
    const newPostRef = push(postsRef);

    await set(newPostRef, {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anonymous',
        ...postData,
        createdAt: serverTimestamp(),
    });
};

export const getPosts = async (): Promise<Post[]> => {
    const postsRef = ref(db, 'posts');
    const snapshot = await get(postsRef);
    if (snapshot.exists()) {
        const postsData = snapshot.val();
        return Object.keys(postsData)
            .map(key => ({ id: key, ...postsData[key] }))
            .sort((a, b) => b.createdAt - a.createdAt);
    }
    return [];
};
