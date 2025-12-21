const { MPesa } = require('@safaricom-et/mpesa-node-js-sdk');

class MpesaService {
    constructor() {
        this.mpesa = null;
        this.isInitialized = false;
    }

    init() {
        if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
            console.warn('⚠️ M-PESA credentials missing. M-PESA features will run in mock mode.');
            return;
        }

        try {
            this.mpesa = MPesa.getInstance({
                apiKey: process.env.MPESA_CONSUMER_KEY,
                secretKey: process.env.MPESA_CONSUMER_SECRET,
                environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
                retries: 3
            });
            this.isInitialized = true;
            console.log('✅ M-PESA SDK Initialized');
        } catch (error) {
            console.error('❌ M-PESA Initialization Error:', error);
        }
    }

    async initiateStkPush(phoneNumber, amount, accountReference = 'WalletTopUp') {
        if (!this.isInitialized) {
            console.log('Simulating STK Push for:', { phoneNumber, amount });
            return {
                MerchantRequestID: 'mock-' + Date.now(),
                CheckoutRequestID: 'mock-chk-' + Date.now(),
                ResponseCode: '0',
                ResponseDescription: 'Success. Request accepted for processing',
                CustomerMessage: 'Success. Request accepted for processing',
                isMock: true
            };
        }

        try {
            const payload = {
                BusinessShortCode: process.env.MPESA_SHORTCODE,
                Password: this.generatePassword(),
                Timestamp: this.getTimestamp(),
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: process.env.MPESA_SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: process.env.MPESA_CALLBACK_URL,
                AccountReference: accountReference,
                TransactionDesc: 'Top up TemariWare Wallet',
            };

            const response = await this.mpesa.stkPush(payload);
            return response;
        } catch (error) {
            console.error('M-PESA STK Push Error:', error);
            throw error;
        }
    }

    // Helper to generate password for STK Push
    generatePassword() {
        const timestamp = this.getTimestamp();
        const shortCode = process.env.MPESA_SHORTCODE;
        const passKey = process.env.MPESA_PASSKEY;
        return Buffer.from(shortCode + passKey + timestamp).toString('base64');
    }

    getTimestamp() {
        const now = new Date();
        return now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    }
}

module.exports = new MpesaService();
