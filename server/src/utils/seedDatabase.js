const mongoose = require('mongoose');
const Product = require('../model/Product');
require('dotenv').config();

// Product data with Cloudinary URLs (replace these with your actual Cloudinary URLs)
const productsData = [
  {
    legacyId: "aaaaa",
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 100,
    image: [
      "https://res.cloudinary.com/dillvadgr/image/upload/v1/forever-ecommerce/products/p_img1.jpg"
    ],
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
      "https://res.cloudinary.com/dillvadgr/image/upload/v1/forever-ecommerce/products/p_img2_1.jpg",
      "https://res.cloudinary.com/dillvadgr/image/upload/v1/forever-ecommerce/products/p_img2_2.jpg",
      "https://res.cloudinary.com/dillvadgr/image/upload/v1/forever-ecommerce/products/p_img2_3.jpg",
      "https://res.cloudinary.com/dillvadgr/image/upload/v1/forever-ecommerce/products/p_img2_4.jpg"
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
    image: ["p_img3.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "L", "XL"],
    date: 1716234545448,
    bestseller: true
  },
  {
    legacyId: "aaaad",
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 110,
    image: ["p_img4.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "XXL"],
    date: 1716621345448,
    bestseller: true
  },
  {
    legacyId: "aaaae",
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 130,
    image: ["p_img5.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716622345448,
    bestseller: true
  },
  {
    legacyId: "aaaaf",
    name: "Girls Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 140,
    image: ["p_img6.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "L", "XL"],
    date: 1716623423448,
    bestseller: true
  },
  {
    legacyId: "aaaag",
    name: "Men Tapered Fit Flat-Front Trousers",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 190,
    image: ["p_img7.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "L", "XL"],
    date: 1716621542448,
    bestseller: false
  },
  {
    legacyId: "aaaah",
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 140,
    image: ["p_img8.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716622345448,
    bestseller: false
  },
  {
    legacyId: "aaaai",
    name: "Girls Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 100,
    image: ["p_img9.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716621235448,
    bestseller: false
  },
  {
    legacyId: "aaaaj",
    name: "Men Tapered Fit Flat-Front Trousers",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 110,
    image: ["p_img10.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "L", "XL"],
    date: 1716622235448,
    bestseller: false
  },
  {
    legacyId: "aaaak",
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 120,
    image: ["p_img11.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716623345448,
    bestseller: false
  },
  {
    legacyId: "aaaal",
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 150,
    image: ["p_img12.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716624445448,
    bestseller: false
  },
  {
    legacyId: "aaaam",
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 130,
    image: ["p_img13.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716625545448,
    bestseller: false
  },
  {
    legacyId: "aaaan",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 160,
    image: ["p_img14.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716626645448,
    bestseller: false
  },
  {
    legacyId: "aaaao",
    name: "Men Tapered Fit Flat-Front Trousers",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 140,
    image: ["p_img15.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716627745448,
    bestseller: false
  },
  {
    legacyId: "aaaap",
    name: "Girls Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 170,
    image: ["p_img16.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716628845448,
    bestseller: false
  },
  {
    legacyId: "aaaaq",
    name: "Men Tapered Fit Flat-Front Trousers",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 150,
    image: ["p_img17.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716629945448,
    bestseller: false
  },
  {
    legacyId: "aaaar",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 180,
    image: ["p_img18.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716631045448,
    bestseller: false
  },
  {
    legacyId: "aaaas",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 160,
    image: ["p_img19.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716632145448,
    bestseller: false
  },
  {
    legacyId: "aaaat",
    name: "Women Palazzo Pants with Waist Belt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 190,
    image: ["p_img20.png"],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716633245448,
    bestseller: false
  },
  {
    legacyId: "aaaau",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 170,
    image: ["p_img21.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716634345448,
    bestseller: false
  },
  {
    legacyId: "aaaav",
    name: "Women Palazzo Pants with Waist Belt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 200,
    image: ["p_img22.png"],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716635445448,
    bestseller: false
  },
  {
    legacyId: "aaaaw",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 180,
    image: ["p_img23.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716636545448,
    bestseller: false
  },
  {
    legacyId: "aaaax",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 210,
    image: ["p_img24.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716637645448,
    bestseller: false
  },
  {
    legacyId: "aaaay",
    name: "Girls Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 190,
    image: ["p_img25.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716638745448,
    bestseller: false
  },
  {
    legacyId: "aaaaz",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 220,
    image: ["p_img26.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716639845448,
    bestseller: false
  },
  {
    legacyId: "aaaba",
    name: "Girls Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 200,
    image: ["p_img27.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716640945448,
    bestseller: false
  },
  {
    legacyId: "aaabb",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 230,
    image: ["p_img28.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716642045448,
    bestseller: false
  },
  {
    legacyId: "aaabc",
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 210,
    image: ["p_img29.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716643145448,
    bestseller: false
  },
  {
    legacyId: "aaabd",
    name: "Girls Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 240,
    image: ["p_img30.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716644245448,
    bestseller: false
  },
  {
    legacyId: "aaabe",
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 220,
    image: ["p_img31.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716645345448,
    bestseller: false
  },
  {
    legacyId: "aaabf",
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 250,
    image: ["p_img32.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716646445448,
    bestseller: false
  },
  {
    legacyId: "aaabg",
    name: "Girls Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 230,
    image: ["p_img33.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716647545448,
    bestseller: false
  },
  {
    legacyId: "aaabh",
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 260,
    image: ["p_img34.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716648645448,
    bestseller: false
  },
  {
    legacyId: "aaabi",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 240,
    image: ["p_img35.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716649745448,
    bestseller: false
  },
  {
    legacyId: "aaabj",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 270,
    image: ["p_img36.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716650845448,
    bestseller: false
  },
  {
    legacyId: "aaabk",
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 250,
    image: ["p_img37.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716651945448,
    bestseller: false
  },
  {
    legacyId: "aaabl",
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 280,
    image: ["p_img38.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716653045448,
    bestseller: false
  },
  {
    legacyId: "aaabm",
    name: "Men Printed Plain Cotton Shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 260,
    image: ["p_img39.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716654145448,
    bestseller: false
  },
  {
    legacyId: "aaabn",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 290,
    image: ["p_img40.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716655245448,
    bestseller: false
  },
  {
    legacyId: "aaabo",
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 270,
    image: ["p_img41.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716656345448,
    bestseller: false
  },
  {
    legacyId: "aaabp",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 300,
    image: ["p_img42.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716657445448,
    bestseller: false
  },
  {
    legacyId: "aaabq",
    name: "Kid Tapered Slim Fit Trouser",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 280,
    image: ["p_img43.png"],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716658545448,
    bestseller: false
  },
  {
    legacyId: "aaabr",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 310,
    image: ["p_img44.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716659645448,
    bestseller: false
  },
  {
    legacyId: "aaabs",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 290,
    image: ["p_img45.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716660745448,
    bestseller: false
  },
  {
    legacyId: "aaabt",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 320,
    image: ["p_img46.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716661845448,
    bestseller: false
  },
  {
    legacyId: "aaabu",
    name: "Kid Tapered Slim Fit Trouser",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 300,
    image: ["p_img47.png"],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716662945448,
    bestseller: false
  },
  {
    legacyId: "aaabv",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 330,
    image: ["p_img48.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716664045448,
    bestseller: false
  },
  {
    legacyId: "aaabw",
    name: "Kid Tapered Slim Fit Trouser",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 310,
    image: ["p_img49.png"],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716665145448,
    bestseller: false
  },
  {
    legacyId: "aaabx",
    name: "Kid Tapered Slim Fit Trouser",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 340,
    image: ["p_img50.png"],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716666245448,
    bestseller: false
  },
  {
    legacyId: "aaaby",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 320,
    image: ["p_img51.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716667345448,
    bestseller: false
  },
  {
    legacyId: "aaabz",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 350,
    image: ["p_img52.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716668445448,
    bestseller: false
  }
];

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
      // Don't set _id, let MongoDB generate it
      legacyId: product.legacyId, // Store the old ID for reference
      name: product.name,
      description: product.description,
      price: enhancePrice(product.price, product.category, product.subCategory, product.bestseller),
      category: product.category,
      subCategory: product.subCategory,
      sizes: product.sizes,
      image: product.image, // These should now be Cloudinary URLs
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
      console.log('🌱 Starting database seeding process...');
      
      if (clearFirst) {
        const cleared = await this.clearExistingData();
        if (!cleared) return false;
      }

      this.totalProducts = productsData.length;
      console.log(`📦 Processing ${this.totalProducts} products...`);

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

      console.log(`✅ Successfully seeded ${this.successCount} products!`);
      return true;
    } catch (error) {
      console.error('❌ Seeding process failed:', error);
      return false;
    }
  }

  async generateDetailedReport() {
    try {
      console.log('\n📊 GENERATING DETAILED SEEDING REPORT');
      console.log('='.repeat(60));

      // Basic statistics
      const basicStats = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            totalValue: { $sum: '$price' },
            avgPrice: { $avg: '$price' },
            totalStock: { $sum: '$stockQuantity' },
            bestsellers: { $sum: { $cond: ['$bestseller', 1, 0] } },
            avgRating: { $avg: '$rating' },
            totalReviews: { $sum: '$reviewCount' }
          }
        }
      ]);

      // Category breakdown
      const categoryStats = await Product.aggregate([
        { 
          $group: { 
            _id: '$category', 
            count: { $sum: 1 }, 
            avgPrice: { $avg: '$price' },
            totalValue: { $sum: '$price' },
            avgRating: { $avg: '$rating' }
          } 
        },
        { $sort: { count: -1 } }
      ]);

      // Sub-category breakdown
      const subCategoryStats = await Product.aggregate([
        { 
          $group: { 
            _id: '$subCategory', 
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' }
          } 
        },
        { $sort: { count: -1 } }
      ]);

      // Display results
      if (basicStats[0]) {
        const stats = basicStats[0];
        console.log(`✅ Total Products Seeded: ${stats.totalProducts.toLocaleString()}`);
        console.log(`💰 Total Inventory Value: LKR ${stats.totalValue.toLocaleString()}`);
        console.log(`📊 Average Product Price: LKR ${stats.avgPrice.toFixed(2)}`);
        console.log(`📦 Total Stock Units: ${stats.totalStock.toLocaleString()}`);
        console.log(`⭐ Bestseller Products: ${stats.bestsellers}`);
        console.log(`🌟 Average Product Rating: ${stats.avgRating.toFixed(2)}/5.0`);
        console.log(`💬 Total Reviews: ${stats.totalReviews.toLocaleString()}`);
      }

      console.log('\n📂 CATEGORY BREAKDOWN:');
      categoryStats.forEach(cat => {
        console.log(`  ${cat._id}:`);
        console.log(`    - Products: ${cat.count}`);
        console.log(`    - Avg Price: LKR ${cat.avgPrice.toFixed(2)}`);
        console.log(`    - Total Value: LKR ${cat.totalValue.toLocaleString()}`);
        console.log(`    - Avg Rating: ${cat.avgRating.toFixed(2)}/5.0`);
      });

      console.log('\n🏷️  SUB-CATEGORY BREAKDOWN:');
      subCategoryStats.forEach(sub => {
        console.log(`  ${sub._id}: ${sub.count} products (avg: LKR ${sub.avgPrice.toFixed(2)})`);
      });

      if (this.failedProducts.length > 0) {
        console.log('\n⚠️  FAILED PRODUCTS:');
        this.failedProducts.forEach(name => console.log(`  - ${name}`));
      }

      console.log('\n🎯 SEEDING SUMMARY:');
      console.log(`  ✅ Successful: ${this.successCount}/${this.totalProducts}`);
      console.log(`  ❌ Failed: ${this.failedProducts.length}/${this.totalProducts}`);
      console.log(`  📊 Success Rate: ${((this.successCount / this.totalProducts) * 100).toFixed(1)}%`);

    } catch (error) {
      console.error('❌ Failed to generate report:', error);
    }
  }

  async run() {
    console.log('🚀 Starting Forever E-Commerce Database Seeding');
    console.log('================================================');
    
    const connected = await this.connectDB();
    if (!connected) {
      console.log('💥 Database connection failed. Exiting...');
      process.exit(1);
    }

    const seeded = await this.seedProducts();
    if (seeded) {
      console.log('\n🎉 Database seeding completed successfully!');
      await this.generateDetailedReport();
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