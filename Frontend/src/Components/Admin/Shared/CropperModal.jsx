import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../Products/ImageCropping";
function CropperModal({
  mainImage,
  setMainImage,
  setImageFiles,
  selectedImage,
  setSelectedImage,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Handle cropping completion
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  // Save Cropped Image
  const saveCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels
      );

      if (!mainImage) {
        setMainImage(croppedImage); // Set as main image if not set
      } else {
        setImageFiles((prev) => [...prev, croppedImage]); // Add to additional images
      }

      setSelectedImage(null); // Close cropper
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };
  return (
    <>
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={550 / 543}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 fixed top-14 right-5 bg-gray-300 rounded-md">
                Cancel
              </button>
              <button
                onClick={saveCroppedImage}
                className="px-4 py-2 fixed top-14 right-28 bg-blue-500 text-white rounded-md">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CropperModal;
