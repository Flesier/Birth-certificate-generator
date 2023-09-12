const express = require('express');
const mongoose = require('mongoose');
const BirthCertificate = require('./src/models/birthCertificate');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


// connect to the database-MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/birthcertificate', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to the database!');
}).catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
});

const birthCertificateSchema = new mongoose.Schema({
    name: String,
    dateOfBirth: String,
    placeOfBirth: String,
    maidenName: String
}, {
    collection: 'birthCertificates',
});

module.exports = BirthCertificate;


app.get('/getbirthcertificates', async (req, res) => {
    try {
        const birthCertificates = await BirthCertificate.find();
        res.send(birthCertificates);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});


// Routes
const certificatesRouter = require('./src/routes/certificates.js');
app.use('/certificates', certificatesRouter);


//starting server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});