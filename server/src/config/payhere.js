const crypto = require('crypto');

const payHereConfig = {
  merchant_id: process.env.PAYHERE_MERCHANT_ID,
  merchant_secret: process.env.PAYHERE_MERCHANT_SECRET,
  currency: 'LKR',
  sandbox: process.env.NODE_ENV !== 'production', // Use sandbox for development
  
  // URLs
  return_url: process.env.PAYHERE_RETURN_URL,
  cancel_url: process.env.PAYHERE_CANCEL_URL,
  notify_url: process.env.PAYHERE_NOTIFY_URL,
  
  // Sandbox URLs
  sandbox_url: 'https://sandbox.payhere.lk/pay/checkout',
  live_url: 'https://www.payhere.lk/pay/checkout'
};

// Generate PayHere hash
const generatePayHereHash = (data) => {
  const {
    merchant_id,
    order_id,
    amount,
    currency = 'LKR',
    merchant_secret
  } = data;

  // PayHere hash format: md5(merchant_id + order_id + amount + currency + merchant_secret)
  const hashString = `${merchant_id}${order_id}${parseFloat(amount).toFixed(2)}${currency}${merchant_secret}`;
  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
};

// Verify PayHere notification hash
const verifyPayHereHash = (data) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    merchant_secret
  } = data;

  const hashString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${merchant_secret}`;
  const localHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
  
  return localHash === md5sig;
};

module.exports = {
  payHereConfig,
  generatePayHereHash,
  verifyPayHereHash
};