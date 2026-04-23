const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Check if Cloudinary credentials exist to prevent server crash
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('⚠️ Cloudinary not configured. File uploads will not work.');
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'crm_attachments',
    allowed_formats: ['jpg', 'png', 'pdf', 'docx', 'xlsx'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
