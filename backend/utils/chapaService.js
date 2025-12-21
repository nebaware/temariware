const axios = require('axios');

class ChapaService {
    constructor() {
        this.apiKey = process.env.CHAPA_SECRET_KEY;
        this.baseURL = 'https://api.chapa.co/v1';
        this.isMockMode = !this.apiKey || this.apiKey === 'your_chapa_secret_key_here';

        if (this.isMockMode) {
            console.log('⚠️  Chapa running in MOCK mode (no API key configured)');
        } else {
            console.log('✅ Chapa initialized');
        }
    }

    async initializePayment(data) {
        const { amount, email, firstName, lastName, txRef, callbackUrl, returnUrl } = data;

        if (this.isMockMode) {
            // Mock response for development
            return {
                success: true,
                message: 'Mock payment initialized',
                data: {
                    checkout_url: `http://localhost:5173/payment-mock?tx_ref=${txRef}&amount=${amount}`,
                    tx_ref: txRef
                }
            };
        }

        try {
            const response = await axios.post(
                `${this.baseURL}/transaction/initialize`,
                {
                    amount,
                    currency: 'ETB',
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    tx_ref: txRef,
                    callback_url: callbackUrl,
                    return_url: returnUrl,
                    customization: {
                        title: 'TemariWare Subscription',
                        description: 'Upgrade to Pro'
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('Chapa initialization error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    async verifyPayment(txRef) {
        if (this.isMockMode) {
            // Mock successful verification
            return {
                success: true,
                data: {
                    status: 'success',
                    amount: 99,
                    currency: 'ETB',
                    tx_ref: txRef,
                    charge: 1.5
                }
            };
        }

        try {
            const response = await axios.get(
                `${this.baseURL}/transaction/verify/${txRef}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('Chapa verification error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }
}

const chapaService = new ChapaService();
module.exports = chapaService;
