const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

<<<<<<< HEAD
// Test the configuration on startup
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
  process.exit(1);
}

if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  console.error('❌ Invalid STRIPE_SECRET_KEY format');
  process.exit(1);
}

console.log('✅ Stripe configuration loaded successfully');

=======
>>>>>>> fc516e54968e5384d3ca1dc9de5f4d4c8aa1d316
module.exports = stripe;