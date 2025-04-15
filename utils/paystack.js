const https = require('https');
require('dotenv').config();

class PayStack {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  async initializeTransaction(data) {
    return this.makeRequest('/transaction/initialize', 'POST', data);
  }

  async verifyTransaction(reference) {
    return this.makeRequest(`/transaction/verify/${reference}`, 'GET');
  }

  makeRequest(path, method, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path,
        method,
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(responseData));
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }
}

const paystack = new PayStack(process.env.PAYSTACK_SECRET_KEY);
module.exports = paystack;