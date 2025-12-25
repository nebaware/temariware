const mongoose = require('mongoose');

const MentorshipSchema = new mongoose.Schema({
    isActivelyMentoring: { type: Boolean, default: false },
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    mentoringTopics: [String]
});

module.exports = MentorshipSchema;
