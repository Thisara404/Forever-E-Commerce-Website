const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload image
const uploadImage = async (filePath, folder = 'forever-ecommerce') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: [
        { width: 800, height: 800, crop: 'fill', quality: 'auto' }
      ]
    });
    return result;
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

// Function to delete image
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Image deletion failed');
  }
};

// Export the configured cloudinary instance directly
module.exports = cloudinary;

// Also export the utility functions
module.exports.uploadImage = uploadImage;
module.exports.deleteImage = deleteImage;