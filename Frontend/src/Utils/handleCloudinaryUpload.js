import axios from "axios";

//conver blob to normal image.png
const convertBlobUrlToFile = async (blobUrl) => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const file = new File(
    [blob],
    `image_${new Date().toLocaleString().replace(/[/: ]/g, "_")}.png`,
    { type: blob.type }
  );
  return file;
};

async function handleCloudinaryUpload(mainImage, imageFiles) {
  let uploadFiles;
  if (mainImage) {
    uploadFiles = [mainImage, ...imageFiles];
  } else {
    uploadFiles = imageFiles;
  }

  const images = [];
  for (const uploadFile of uploadFiles) {
    const uploadImage = await convertBlobUrlToFile(uploadFile);

    //uploading starts
    const formData = new FormData();
    formData.append("file", uploadImage);
    formData.append("upload_preset", "profilepicturepreset");

    const res = await axios.post(
      `${import.meta.env.VITE_CLOUDNARY_ENDPOINT}`,
      formData,
      { withCredentials: false }
    );

    //uploading ends
    images.push(res.data.secure_url);
  }

  return images;
}

export default handleCloudinaryUpload;
