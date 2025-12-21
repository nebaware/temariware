const mongoose = require('mongoose');

const SocialLinksSchema = new mongoose.Schema({
    github: String,
    linkedin: String,
    twitter: String,
    portfolio: String
});

module.exports = SocialLinksSchema;
