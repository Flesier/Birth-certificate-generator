//data model for the birth certificate using mongoose
const mongoose = require('mongoose');

const birthCertificateSchema = new mongoose.Schema({
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
}, {
  collection: 'birthcertificates', 
});

const BirthCertificate = mongoose.model('BirthCertificate', birthCertificateSchema);
module.exports = BirthCertificate;