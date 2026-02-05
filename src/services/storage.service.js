const ImageKit = require("imagekit");

// Check if ImageKit environment variables are properly configured
if (!process.env.IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY === 'xxxxxxxx') {
  console.warn('⚠️  ImageKit keys not configured. Please update your .env file with proper ImageKit credentials.');
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file, fileName) {
  try {
    if (!file) {
      throw new Error("No file provided for upload");
    }

    // Check if ImageKit is properly configured
    if (!process.env.IMAGEKIT_PUBLIC_KEY || 
        process.env.IMAGEKIT_PUBLIC_KEY === 'xxxxxxxx' ||
        !process.env.IMAGEKIT_PRIVATE_KEY ||
        process.env.IMAGEKIT_PRIVATE_KEY === 'xxxxxxxx') {
      throw new Error("ImageKit is not properly configured. Please update your environment variables.");
    }

    const result = await imagekit.upload({
      file,       // buffer
      fileName,   // unique name
    });

    return result; // contains url, fileId, etc.
  } catch (error) {
    console.error("Image upload failed:", error.message);
    throw error; // controller will handle
  }
}

module.exports = {
  uploadFile,
};
