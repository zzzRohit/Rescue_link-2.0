import cloudinary from '../config/cloudinary.js';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const isValidDataImage = (value) => /^data:image\/(png|jpe?g|webp);base64,/i.test(value || '');

const approximateBase64Bytes = (dataUrl) => {
  const base64 = String(dataUrl).split(',')[1] || '';
  return Math.ceil((base64.length * 3) / 4);
};

export const uploadImages = async (req, res, next) => {
  try {
    const { images = [] } = req.body;

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'Cloudinary server env vars are missing.' });
    }

    if (!Array.isArray(images) || images.length === 0 || images.length > 3) {
      return res.status(400).json({ message: 'Upload 1 to 3 images.' });
    }

    const invalidImage = images.find((image) => !isValidDataImage(image) || approximateBase64Bytes(image) > MAX_IMAGE_BYTES);
    if (invalidImage) {
      return res.status(400).json({ message: 'Images must be PNG, JPG, or WebP and under 5MB each.' });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const results = await Promise.all(images.map((image) => (
      cloudinary.uploader.upload(image, {
        folder: 'rescuelink',
        resource_type: 'image'
      })
    )));

    res.json({ urls: results.map((result) => result.secure_url) });
  } catch (err) {
    next(err);
  }
};
