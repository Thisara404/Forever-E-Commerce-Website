const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

const uploadProductImages = async () => {
  try {
    console.log('🖼️  Starting image upload to Cloudinary...');
    
    // Test Cloudinary configuration first
    console.log('Testing Cloudinary configuration...');
    try {
      await cloudinary.api.ping();
      console.log('✅ Cloudinary connection successful');
    } catch (configError) {
      console.error('❌ Cloudinary configuration error:', configError.message);
      return;
    }
    
    // Path to your client assets folder
    const assetsPath = path.join(__dirname, '../../../client/src/assets');
    
    // Check if assets folder exists
    if (!fs.existsSync(assetsPath)) {
      console.error('❌ Assets folder not found:', assetsPath);
      return;
    }
    
    // Read all PNG files from assets folder
    const allFiles = fs.readdirSync(assetsPath);
    const files = allFiles.filter(file => 
      file.endsWith('.png') && file.startsWith('p_img')
    );
    
    console.log(`Found ${files.length} product images to upload`);
    console.log('Files found:', files.slice(0, 5), '...'); // Show first 5 files
    
    const uploadResults = [];
    let successCount = 0;
    let failCount = 0;
    
    for (const file of files) {
      try {
        const filePath = path.join(assetsPath, file);
        const fileName = path.parse(file).name; // Remove extension
        
        console.log(`Uploading ${file}...`);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.error(`❌ File not found: ${filePath}`);
          failCount++;
          continue;
        }
        
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'forever-ecommerce/products',
          public_id: fileName,
          overwrite: true,
          transformation: [
            { width: 800, height: 800, crop: 'fill', quality: 'auto' }
          ]
        });
        
        uploadResults.push({
          originalName: file,
          fileName: fileName,
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id
        });
        
        successCount++;
        console.log(`✅ Uploaded ${file} -> ${result.secure_url}`);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        failCount++;
        console.error(`❌ Failed to upload ${file}:`, {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode
        });
      }
    }
    
    // Save the mapping to a JSON file for reference
    const mappingPath = path.join(__dirname, 'image-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(uploadResults, null, 2));
    
    console.log(`\n🎉 Upload complete!`);
    console.log(`✅ Successfully uploaded: ${successCount} images`);
    console.log(`❌ Failed uploads: ${failCount} images`);
    console.log(`📝 Image mapping saved to: ${mappingPath}`);
    
    // Generate the updated products data with Cloudinary URLs
    if (uploadResults.length > 0) {
      generateUpdatedProductsData(uploadResults);
      generateSeedFileWithCloudinaryUrls(uploadResults);
    }
    
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

const generateUpdatedProductsData = (uploadResults) => {
  // Create a mapping from filename to URL
  const imageMap = {};
  uploadResults.forEach(result => {
    imageMap[result.fileName] = result.cloudinaryUrl;
  });
  
  console.log('\n📋 Image URL Mapping:');
  console.log(JSON.stringify(imageMap, null, 2));
};

const generateSeedFileWithCloudinaryUrls = (uploadResults) => {
  // Create a mapping from filename to URL
  const imageMap = {};
  uploadResults.forEach(result => {
    imageMap[result.fileName] = result.cloudinaryUrl;
  });
  
  // Read the existing seed file and update it
  const seedFilePath = path.join(__dirname, 'seedDatabaseWithCloudinary.js');
  
  const seedFileContent = `const mongoose = require('mongoose');
const Product = require('../model/Product');
require('dotenv').config();

// Product data with actual Cloudinary URLs
const productsData = [
  {
    legacyId: "aaaaa",
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 100,
    image: ["${imageMap['p_img1'] || 'https://via.placeholder.com/800x800/333333/FFFFFF?text=Image+1'}"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716634345448,
    bestseller: true
  },
  {
    legacyId: "aaaab",
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 200,
    image: [
      "${imageMap['p_img2_1'] || 'https://via.placeholder.com/800x800/333333/FFFFFF?text=Image+2-1'}",
      "${imageMap['p_img2_2'] || 'https://via.placeholder.com/800x800/333333/FFFFFF?text=Image+2-2'}",
      "${imageMap['p_img2_3'] || 'https://via.placeholder.com/800x800/333333/FFFFFF?text=Image+2-3'}",
      "${imageMap['p_img2_4'] || 'https://via.placeholder.com/800x800/333333/FFFFFF?text=Image+2-4'}"
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716621345448,
    bestseller: true
  },
  {
    legacyId: "aaaac",
    name: "Girls Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 220,
    image: ["${imageMap['p_img3'] || 'https://via.placeholder.com/800x800/333333/FFFFFF?text=Image+3'}"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "L", "XL"],
    date: 1716234545448,
    bestseller: true
  },
  // Add more products here with Cloudinary URLs...
  ${generateProductEntries(imageMap)}
];

// Database seeder class (same as before)
class DatabaseSeeder {
  constructor() {
    this.totalProducts = 0;
    this.successCount = 0;
    this.failedProducts = [];
  }

  async connectDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('🔗 MongoDB connected successfully for seeding...');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  async clearExistingData() {
    try {
      const deletedCount = await Product.countDocuments();
      await Product.deleteMany({});
      console.log(\`🗑️  Cleared \${deletedCount} existing products from database\`);
      return true;
    } catch (error) {
      console.error('❌ Failed to clear existing data:', error);
      return false;
    }
  }

  generateEnhancedProductData(product) {
    const generateStock = (category, bestseller) => {
      const baseStock = {
        'Men': { min: 50, max: 120 },
        'Women': { min: 40, max: 100 },
        'Kids': { min: 30, max: 80 }
      };
      
      const range = baseStock[category] || { min: 25, max: 70 };
      const multiplier = bestseller ? 1.5 : 1;
      
      return Math.floor(
        (Math.random() * (range.max - range.min + 1) + range.min) * multiplier
      );
    };

    const enhancePrice = (basePrice, category, subCategory, bestseller) => {
      let multiplier = 1;
      
      if (category === 'Men' && subCategory === 'Winterwear') multiplier = 1.3;
      else if (category === 'Women' && subCategory === 'Winterwear') multiplier = 1.25;
      else if (subCategory === 'Topwear') multiplier = 1.1;
      else if (subCategory === 'Bottomwear') multiplier = 1.15;
      
      if (bestseller) multiplier *= 1.1;
      
      return Math.round(basePrice * multiplier);
    };

    const generateTags = (name, category, subCategory) => {
      const tags = [category.toLowerCase(), subCategory.toLowerCase()];
      
      if (name.toLowerCase().includes('cotton')) tags.push('cotton');
      if (name.toLowerCase().includes('denim')) tags.push('denim');
      if (name.toLowerCase().includes('printed')) tags.push('printed');
      if (name.toLowerCase().includes('slim')) tags.push('slim-fit');
      if (name.toLowerCase().includes('relaxed')) tags.push('relaxed-fit');
      if (name.toLowerCase().includes('round neck')) tags.push('round-neck');
      if (name.toLowerCase().includes('tapered')) tags.push('tapered');
      
      return [...new Set(tags)];
    };

    const generateRatingData = (bestseller) => {
      const baseRating = bestseller ? 4.0 : 3.5;
      const rating = Math.round((baseRating + Math.random() * 1.0) * 10) / 10;
      const reviewCount = bestseller 
        ? Math.floor(Math.random() * 200) + 50 
        : Math.floor(Math.random() * 100) + 10;
      
      return { rating: Math.min(rating, 5.0), reviewCount };
    };

    const { rating, reviewCount } = generateRatingData(product.bestseller);

    return {
      legacyId: product.legacyId,
      name: product.name,
      description: product.description,
      price: enhancePrice(product.price, product.category, product.subCategory, product.bestseller),
      category: product.category,
      subCategory: product.subCategory,
      sizes: product.sizes,
      image: product.image,
      bestseller: product.bestseller || false,
      inStock: true,
      stockQuantity: generateStock(product.category, product.bestseller),
      rating,
      reviewCount,
      discount: product.bestseller ? Math.floor(Math.random() * 15) + 5 : 0,
      tags: generateTags(product.name, product.category, product.subCategory),
      sku: \`\${product.category.substring(0, 2).toUpperCase()}\${product.legacyId.substring(0, 6).toUpperCase()}\`,
      createdAt: new Date(product.date),
      updatedAt: new Date()
    };
  }

  async seedProducts(clearFirst = true) {
    try {
      console.log('🌱 Starting database seeding process...');
      
      if (clearFirst) {
        const cleared = await this.clearExistingData();
        if (!cleared) return false;
      }

      this.totalProducts = productsData.length;
      console.log(\`📦 Processing \${this.totalProducts} products...\`);

      const batchSize = 20;
      
      for (let i = 0; i < productsData.length; i += batchSize) {
        const batch = productsData.slice(i, i + batchSize);
        const transformedBatch = [];

        for (const product of batch) {
          try {
            const enhancedProduct = this.generateEnhancedProductData(product);
            transformedBatch.push(enhancedProduct);
          } catch (error) {
            console.error(\`⚠️  Failed to transform product \${product.name}:\`, error);
            this.failedProducts.push(product.name);
          }
        }

        if (transformedBatch.length > 0) {
          await Product.insertMany(transformedBatch);
          this.successCount += transformedBatch.length;
          
          const progress = ((i + batchSize) / productsData.length * 100).toFixed(1);
          console.log(\`📈 Progress: \${this.successCount}/\${this.totalProducts} products (\${progress}%)\`);
        }
      }

      console.log(\`✅ Successfully seeded \${this.successCount} products!\`);
      return true;
    } catch (error) {
      console.error('❌ Seeding process failed:', error);
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting Forever E-Commerce Database Seeding with Cloudinary Images');
    console.log('===================================================================');
    
    const connected = await this.connectDB();
    if (!connected) {
      console.log('💥 Database connection failed. Exiting...');
      process.exit(1);
    }

    const seeded = await this.seedProducts();
    if (seeded) {
      console.log('\\n🎉 Database seeding completed successfully!');
    } else {
      console.log('\\n💥 Seeding process failed!');
    }

    await mongoose.connection.close();
    console.log('\\n🔐 Database connection closed');
    process.exit(seeded ? 0 : 1);
  }
}

// Export for programmatic use
module.exports = DatabaseSeeder;

// Run if called directly
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  seeder.run();
}
`;

  fs.writeFileSync(seedFilePath, seedFileContent);
  console.log(`\n📄 Generated seed file with Cloudinary URLs: ${seedFilePath}`);
};

function generateProductEntries(imageMap) {
  const products = [];
  for (let i = 4; i <= 52; i++) {
    const imgKey = `p_img${i}`;
    const url = imageMap[imgKey] || `https://via.placeholder.com/800x800/333333/FFFFFF?text=Image+${i}`;
    
    products.push(`  {
    legacyId: "product${i}",
    name: "Product ${i}",
    description: "A high-quality product with excellent features and comfortable design.",
    price: ${Math.floor(Math.random() * 200) + 100},
    image: ["${url}"],
    category: "${i % 3 === 0 ? 'Kids' : i % 2 === 0 ? 'Women' : 'Men'}",
    subCategory: "${i % 3 === 0 ? 'Topwear' : i % 2 === 0 ? 'Bottomwear' : 'Winterwear'}",
    sizes: ["S", "M", "L", "XL"],
    date: ${Date.now() - (i * 100000)},
    bestseller: ${i <= 10 ? 'true' : 'false'}
  }`);
  }
  return products.join(',\n');
}

// Run if called directly
if (require.main === module) {
  uploadProductImages();
}

module.exports = { uploadProductImages };