const CLOUD_NAME = 'dookpytjh';
const UPLOAD_PRESET = 'homework';

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Cloudinary upload failed');
        }

        const data = await response.json();
        return data.public_id as string;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};
