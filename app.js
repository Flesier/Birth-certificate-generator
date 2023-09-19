const express = require('express');
const mongoose = require('mongoose');
const BirthCertificate = require('./src/models/birthCertificate');
const generatePDF = require('./src/utils/pdfGenerator');

require('dotenv').config();
const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 3000;

//Oauth 
const { auth, requiresAuth } = require('express-openid-connect');
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
  };
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
  

app.use(express.json());
app.set('view-engine', 'ejs');

// Serve static files (CSS, JavaScript, images, etc.) from a directory
app.use(express.static('public')); // Replace 'public' with your actual static files directory



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

//render homepage
app.get('/', (req, res) => {
    console.log(req.oidc.isAuthenticated());
    res.render('index.ejs');
});


//authentication inorder to login users and connect to our form



//render form page when clicked
app.get('/form', requiresAuth(), (req, res) => {
    res.render('form.ejs');
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
        const birthCertificateData = req.body;
        const pdfData = await generatePDF(birthCertificateData);

        if (pdfData) {
            const birthCertificate = new BirthCertificate(birthCertificateData);
            await birthCertificate.save();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=birth_certificate.pdf');
            res.send(pdfData);
        } else {
            res.status(500).json({ error: 'PDF generation failed' });
        }
    } catch (err) {
        console.error(err);
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