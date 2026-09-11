const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

require('dotenv').config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Ensure an Eyeglasses category exists
    let categoryEyeglasses = await Category.findOne({ name: 'Eyeglasses' });
    if (!categoryEyeglasses) {
      categoryEyeglasses = await Category.create({
        name: 'Eyeglasses',
        description: 'Premium optical frames for everyday wear.',
      });
    }

    // Ensure a Sunglasses category exists
    let categorySunglasses = await Category.findOne({ name: 'Sunglasses' });
    if (!categorySunglasses) {
      categorySunglasses = await Category.create({
        name: 'Sunglasses',
        description: 'Premium sun protection and style.',
      });
    }

    console.log('Clearing existing products...');
    await Product.deleteMany();

    const products = [
      {
        name: 'AURA Minimalist Titanium',
        description: 'Ultra-lightweight titanium frames featuring a sleek, minimalist round design. Perfect for an elegant, modern aesthetic.',
        price: 245,
        category: categoryEyeglasses._id,
        brand: 'AURA',
        frameShape: 'Round',
        frameColor: 'Silver',
        frameMaterial: 'Titanium',
        gender: 'Unisex',
        size: 'Medium',
        lensTypes: ['Clear', 'Blue Light', 'Prescription'],
        mainImage: { url: '/images/aura_minimalist_titanium_1789105812963.jpg', public_id: 'aura_minimalist_titanium' },
        stock: 50,
        isFeatured: true,
      },
      {
        name: 'VANGUARD Bold Acetate',
        description: 'Thick, bold square frames crafted from premium Italian acetate. Designed for those who want to make a statement.',
        price: 185,
        category: categoryEyeglasses._id,
        brand: 'VANGUARD',
        frameShape: 'Square',
        frameColor: 'Tortoiseshell',
        frameMaterial: 'Acetate',
        gender: 'Men',
        size: 'Large',
        lensTypes: ['Clear', 'Prescription'],
        mainImage: { url: '/images/vanguard_bold_acetate_1789105828178.jpg', public_id: 'vanguard_bold_acetate' },
        stock: 30,
        isFeatured: true,
      },
      {
        name: 'ECLIPSE Cat-Eye',
        description: 'Vintage-inspired cat-eye frames with a contemporary edge. Sharp, angular, and undeniably chic.',
        price: 210,
        category: categoryEyeglasses._id,
        brand: 'LUMIÈRE',
        frameShape: 'Cat-Eye',
        frameColor: 'Black',
        frameMaterial: 'Acetate',
        gender: 'Women',
        size: 'Medium',
        lensTypes: ['Clear', 'Blue Light'],
        mainImage: { url: '/images/eclipse_cat_eye_1789105965244.jpg', public_id: 'eclipse_cat_eye' },
        stock: 45,
        isFeatured: false,
      },
      {
        name: 'HORIZON Aviator Optical',
        description: 'Classic aviator silhouette reimagined for everyday optical wear. Featuring delicate gold wireframes.',
        price: 195,
        category: categoryEyeglasses._id,
        brand: 'HORIZON',
        frameShape: 'Aviator',
        frameColor: 'Gold',
        frameMaterial: 'Metal',
        gender: 'Unisex',
        size: 'Large',
        lensTypes: ['Clear', 'Prescription'],
        mainImage: { url: '/images/horizon_aviator_optical_1789105977008.jpg', public_id: 'horizon_aviator_optical' },
        stock: 25,
        isFeatured: true,
      },
      {
        name: 'ZENITH Translucent Rectangle',
        description: 'Modern rectangular frames in a beautiful crystal-clear translucent finish. Subtle and highly versatile.',
        price: 160,
        category: categoryEyeglasses._id,
        brand: 'ZENITH',
        frameShape: 'Rectangle',
        frameColor: 'Clear',
        frameMaterial: 'Acetate',
        gender: 'Unisex',
        size: 'Medium',
        lensTypes: ['Clear', 'Blue Light', 'Prescription'],
        mainImage: { url: '/images/zenith_translucent_rectangle_1789105989584.jpg', public_id: 'zenith_translucent_rectangle' },
        stock: 60,
        isFeatured: false,
      },
      {
        name: 'NOVA Slim Oval',
        description: 'Petite and elegant oval frames for a sophisticated intellectual look. Feather-light for all-day comfort.',
        price: 175,
        category: categoryEyeglasses._id,
        brand: 'LUMIÈRE',
        frameShape: 'Oval',
        frameColor: 'Rose Gold',
        frameMaterial: 'Metal',
        gender: 'Kids',
        size: 'Small',
        lensTypes: ['Clear', 'Prescription'],
        mainImage: { url: '/images/nova_slim_oval_1789106010638.jpg', public_id: 'nova_slim_oval' },
        stock: 15,
        isFeatured: false,
      },
      {
        name: 'ATLAS Two-Tone Square Sunglasses',
        description: 'A contemporary take on the classic square frame, featuring a striking matte black and matte silver two-tone design, with dark tinted lenses.',
        price: 240,
        category: categorySunglasses._id,
        brand: 'ATLAS',
        frameShape: 'Square',
        frameColor: 'Black/Silver',
        frameMaterial: 'Mixed',
        gender: 'Men',
        size: 'Medium',
        lensTypes: ['Sunglasses'],
        mainImage: { url: '/images/atlas_square_sunglasses_1789110519658.jpg', public_id: 'atlas_square_sunglasses' },
        stock: 40,
        isFeatured: true,
      },
      {
        name: 'VISTA Oversized Round Sunglasses',
        description: 'Oversized round sunglasses that deliver an effortlessly chic, artistic vibe with brown tinted lenses. Ideal for wider faces.',
        price: 210,
        category: categorySunglasses._id,
        brand: 'VISTA',
        frameShape: 'Round',
        frameColor: 'Champagne',
        frameMaterial: 'Acetate',
        gender: 'Women',
        size: 'Large',
        lensTypes: ['Sunglasses'],
        mainImage: { url: '/images/vista_round_sunglasses_1789110534214.jpg', public_id: 'vista_round_sunglasses' },
        stock: 20,
        isFeatured: false,
      },
      {
        name: 'OASIS Hexagon Metal Sunglasses',
        description: 'Geometric hexagon sunglasses that blend retro styling with futuristic angles. A true standout piece with gunmetal frames and dark lenses.',
        price: 255,
        category: categorySunglasses._id,
        brand: 'OASIS',
        frameShape: 'Round', // fallback to round for DB enum if hexagon isn't there
        frameColor: 'Gunmetal',
        frameMaterial: 'Metal',
        gender: 'Unisex',
        size: 'Medium',
        lensTypes: ['Sunglasses'],
        mainImage: { url: '/images/oasis_hexagon_sunglasses_1789110888666.jpg', public_id: 'oasis_hexagon_sunglasses' },
        stock: 35,
        isFeatured: true,
      },
      {
        name: 'CLASSIC Browline',
        description: 'The quintessential 1950s browline clubmaster style, updated with modern materials and a flawless finish.',
        price: 215,
        category: categoryEyeglasses._id,
        brand: 'VANGUARD',
        frameShape: 'Square',
        frameColor: 'Black/Gold',
        frameMaterial: 'Mixed',
        gender: 'Men',
        size: 'Medium',
        lensTypes: ['Clear', 'Prescription'],
        mainImage: { url: '/images/classic_browline_1789106205248.jpg', public_id: 'classic_browline' },
        stock: 55,
        isFeatured: false,
      }
    ];

    for (const product of products) {
      await Product.create(product);
    }
    console.log('10 Products Inserted Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error inserting products:', error);
    process.exit(1);
  }
};

seedProducts();
