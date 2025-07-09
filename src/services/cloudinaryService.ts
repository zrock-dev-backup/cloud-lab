const CLOUD_NAME = "dookpytjh";
const UPLOAD_PRESET = "homework";

const _uploadFile = async (
  file: File,
  resource_type: "image" | "video",
): Promise<string> => {
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resource_type}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Cloudinary API Error:", {
        error: errorBody,
        resource_type: resource_type,
        fileName: file.name,
      });
      throw new Error(
        `Cloudinary upload failed for resource type ${resource_type}`,
      );
    }

    const data = await response.json();
    return data.secure_url as string;
  } catch (error) {
    console.error("Error in _uploadFile:", error);
    throw error;
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  return _uploadFile(file, "image");
};

export const uploadAudio = async (file: File): Promise<string> => {
  return _uploadFile(file, "video");
};
