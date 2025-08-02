const cloudinary = require('../config/cloudinary');

const testCloudinary = async () => {
  try {
    console.log('Testing Cloudinary configuration...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');
    
    // Test connection
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', result);
    
    // Test upload with a simple image
    console.log('Testing upload...');
    const uploadResult = await cloudinary.uploader.upload(
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVzdDwvdGV4dD48L3N2Zz4=',
      {
        folder: 'forever-ecommerce/test',
        public_id: 'test-upload'
      }
    );
    console.log('✅ Upload test successful:', uploadResult.secure_url);
    
    // Clean up test image
    await cloudinary.uploader.destroy('forever-ecommerce/test/test-upload');
    console.log('✅ Test cleanup successful');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    });
  }
};

if (require.main === module) {
  testCloudinary();
}

module.exports = { testCloudinary };