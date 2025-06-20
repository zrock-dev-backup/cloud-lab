import React, {useEffect, useState} from 'react';
import {uploadImage} from '../services/cloudinaryService';
import {createPost, getPosts, type Post} from '../services/postService';

export const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostText, setNewPostText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts);
        } catch (err) {
            setError('Failed to fetch posts.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSubmitPost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newPostText || !selectedFile) {
            setError('Please provide both text and an image for your post.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const publicId = await uploadImage(selectedFile);
            await createPost({text: newPostText, publicId});

            setNewPostText('');
            setSelectedFile(null);
            await fetchPosts();
        } catch (err) {
            setError('Failed to create post. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        posts,
        newPostText,
        setNewPostText,
        setSelectedFile,
        isLoading,
        error,
        handleSubmitPost,
    };
};
