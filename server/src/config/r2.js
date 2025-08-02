const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');

// Configure R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Configuration
const r2Config = {
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'forever-ecommerce',
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_ENDPOINT,
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID
};

// Validate configuration
if (!r2Config.accountId) {
  console.error('❌ Cloudflare R2 Account ID not configured');
}

if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
  console.error('❌ Cloudflare R2 credentials not configured');
}

// Function to upload image to R2
const uploadImage = async (buffer, key, folder = 'products') => {
  try {
    // Process image with Sharp
    const processedBuffer = await sharp(buffer)
      .resize(800, 800, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const fullKey = `${folder}/${key}`;
    
    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: fullKey,
      Body: processedBuffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read'
    });

    await r2Client.send(command);
    
    // Return the public URL
    const publicUrl = `${r2Config.publicUrl}/${fullKey}`;
    
    return {
      secure_url: publicUrl,
      public_id: fullKey,
      url: publicUrl
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    throw new Error('Image upload failed');
  }
};

// Function to delete image from R2
const deleteImage = async (publicId) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: r2Config.bucketName,
      Key: publicId
    });

    const result = await r2Client.send(command);
    return result;
  } catch (error) {
    console.error('R2 delete error:', error);
    throw new Error('Image deletion failed');
  }
};

// Function to generate presigned URL for direct upload
const generatePresignedUrl = async (key, expiresIn = 3600) => {
  try {
    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: key,
      ContentType: 'image/jpeg'
    });

    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    throw new Error('Failed to generate presigned URL');
  }
};

module.exports = {
  r2Client,
  r2Config,
  uploadImage,
  deleteImage,
  generatePresignedUrl
};