const express = require('express');
const mongoose = require('mongoose');

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

const BirthCertificate = mongoose.models.BirthCertificate || mongoose.model('BirthCertificate', birthCertificateSchema);


app.get("/getusers", (req, res) => {
    BirthCertificate.find({}).then(function(users) {
        res.json(users);
    }).catch(function(err) {
        console.log(err);
        res.status(500).json({ error: 'Sever Error' });
    });
});


// Routes
const certificatesRouter = require('./src/routes/certificates.js');
app.use('/certificates', certificatesRouter);


//starting server
app.listen(3001, () => {
    console.log(`Server is running on port ${3001}`);
});