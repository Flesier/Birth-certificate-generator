//data model for the birth certificate using mongoose
const mongoose = require('mongoose');

const birthCertificate = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    placeOfBirth: {
        type: String,
        required: true,
    },
    maidenName: {
        type: String,
        required: true,
    },
    // will add more fields if needed
});

//module.exports = mongoose.model('birthCertificate', birthCertificate);