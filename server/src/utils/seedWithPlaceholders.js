const mongoose = require('mongoose');
const Product = require('../model/Product');
require('dotenv').config();

// Generate placeholder image URL
const generatePlaceholderImage = (category, index, variant = '') => {
  const colors = {
    'Men': '1e40af',      // Blue
    'Women': 'db2777',     // Pink
    'Kids': '059669'       // Green
  };
  const color = colors[category] || '374151';
  const text = variant ? `${category}+${index}+${variant}` : `${category}+${index}`;
  return `https://via.placeholder.com/800x800/${color}/FFFFFF?text=${text}`;
};

// Product data with placeholder images
const productsData = [
  {
    legacyId: "aaaaa",
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 100,
    image: [generatePlaceholderImage('Women', 1)],
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
      generatePlaceholderImage('Men', 2, '1'),
      generatePlaceholderImage('Men', 2, '2'),
      generatePlaceholderImage('Men', 2, '3'),
      generatePlaceholderImage('Men', 2, '4')
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
    image: [generatePlaceholderImage('Kids', 3)],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "L", "XL"],
    date: 1716234545448,
    bestseller: true
  }
  // Add more products with placeholder images...
];

// Generate all 52 products with placeholder images
for (let i = 4; i <= 52; i++) {
  const categories = ['Men', 'Women', 'Kids'];
  const subCategories = ['Topwear', 'Bottomwear', 'Winterwear'];
  const category = categories[(i - 1) % 3];
  const subCategory = subCategories[(i - 1) % 3];
  
  productsData.push({
    legacyId: `product${i}`,
    name: `${category} ${subCategory} Product ${i}`,
    description: "A high-quality product with excellent features, comfortable design, and premium materials for everyday wear.",
    price: Math.floor(Math.random() * 300) + 100,
    image: [generatePlaceholderImage(category, i)],
    category: category,
    subCategory: subCategory,
    sizes: ["S", "M", "L", "XL"],
    date: Date.now() - (i * 100000),
    bestseller: i <= 10
  });
}

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
      console.log(`🗑️  Cleared ${deletedCount} existing products from database`);
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
      sku: `${product.category.substring(0, 2).toUpperCase()}${product.legacyId.substring(0, 6).toUpperCase()}`,
      createdAt: new Date(product.date),
      updatedAt: new Date()
    };
  }

  async seedProducts(clearFirst = true) {
    try {
      console.log('🌱 Starting database seeding with placeholder images...');
      
      if (clearFirst) {
        const cleared = await this.clearExistingData();
        if (!cleared) return false;
      }

      this.totalProducts = productsData.length;
      console.log(`📦 Processing ${this.totalProducts} products with placeholder images...`);

      const batchSize = 20;
      
      for (let i = 0; i < productsData.length; i += batchSize) {
        const batch = productsData.slice(i, i + batchSize);
        const transformedBatch = [];

        for (const product of batch) {
          try {
            const enhancedProduct = this.generateEnhancedProductData(product);
            transformedBatch.push(enhancedProduct);
          } catch (error) {
            console.error(`⚠️  Failed to transform product ${product.name}:`, error);
            this.failedProducts.push(product.name);
          }
        }

        if (transformedBatch.length > 0) {
          await Product.insertMany(transformedBatch);
          this.successCount += transformedBatch.length;
          
          const progress = ((i + batchSize) / productsData.length * 100).toFixed(1);
          console.log(`📈 Progress: ${this.successCount}/${this.totalProducts} products (${progress}%)`);
        }
      }

      console.log(`✅ Successfully seeded ${this.successCount} products with placeholder images!`);
      return true;
    } catch (error) {
      console.error('❌ Seeding process failed:', error);
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting Forever E-Commerce Database Seeding with Placeholder Images');
    console.log('====================================================================');
    
    const connected = await this.connectDB();
    if (!connected) {
      console.log('💥 Database connection failed. Exiting...');
      process.exit(1);
    }

    const seeded = await this.seedProducts();
    if (seeded) {
      console.log('\n🎉 Database seeding completed successfully!');
      console.log('📸 All products have placeholder images that will display properly');
      console.log('🔄 You can replace these with real images later using the admin panel');
    } else {
      console.log('\n💥 Seeding process failed!');
    }

    await mongoose.connection.close();
    console.log('\n🔐 Database connection closed');
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