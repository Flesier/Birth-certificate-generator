const express = require('express');
const mongoose = require('mongoose');
const BirthCertificate = require('./src/models/birthCertificate');
const generatePDF = require('./src/utils/pdfGenerator');

const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.set('view-engine', 'ejs');


// connect to the database-MongoDB.connect() method
mongoose.connect('mongodb://127.0.0.1:27017/birthcertificate', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to the database!');
}).catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

//retrieve birth certificates
app.get('/getbirthcertificates', async (req, res) => {
    try {
        const birthCertificates = await BirthCertificate.find();
        res.send(birthCertificates);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});


//create birth certificate
app.post('/birth-certificates', async (req, res) => {
    try {
        const birthCertificateData = req.body; // Assuming req.body contains birth certificate data
        const pdfData = await generatePDF(birthCertificateData); // Wait for the PDF generation
        if (pdfData) {
            const birthCertificate = new BirthCertificate(birthCertificateData);
            await birthCertificate.save();
            res.send(birthCertificate);
            fs.writeFileSync('birth_certificate.pdf', pdfData);
        } else {
            res.status(500).json({ error: 'PDF generation failed' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Routes
//const certificatesRouter = require('./src/routes/certificates.js');
//app.use('/certificates', certificatesRouter);


//starting server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});