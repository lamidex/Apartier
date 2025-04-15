const PayStack = require('paystack-api');

const paystack = PayStack(process.env.PAYSTACK_SECRET_KEY);

module.exports = paystack;