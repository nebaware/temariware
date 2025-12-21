const mongoose = require('mongoose');

const BlockchainCredentialSchema = new mongoose.Schema({
    name: String,
    issuingOrganization: String,
    credentialId: String,
    verificationUrl: String,
    dateIssued: Date
});

module.exports = BlockchainCredentialSchema;
