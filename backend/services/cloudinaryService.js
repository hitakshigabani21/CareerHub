const { cloudinary } = require('../config/cloudinary');

function uploadPdfBuffer(buffer, folder = 'careerhub/resumes') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder,
        format: 'pdf',
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) {
  console.log('===== CLOUDINARY ERROR =====');
  console.log('message:', error.message);
  console.log('http_code:', error.http_code);
  console.log('name:', error.name);
  console.log('full error:', error);
  console.log('============================');

  return reject(error);
}
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function deleteCloudinaryFile(publicId) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
}

module.exports = { uploadPdfBuffer, deleteCloudinaryFile };
