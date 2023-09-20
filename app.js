const express = require('express');
const mongoose = require('mongoose');
const BirthCertificate = require('./src/models/birthCertificate');
const generatePDF = require('./src/utils/pdfGenerator');
const path = require('path'); // Import the 'path' module


require('dotenv').config();
const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 3000;


//for form submission in express
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


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
app.use(auth(config));

app.use(express.json());
app.set('view-engine', 'ejs');

app.use(express.static('public'));



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
    console.log(req.oidc.isAuthenticated());
    res.render('index.ejs');
});

app.get('/form', requiresAuth(), (req, res) => {
    res.render('form.ejs');
});

app.get('/getbirthcertificates', async (req, res) => {
    try {
        const birthCertificates = await BirthCertificate.find();
        res.send(birthCertificates);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/birth-certificates', async (req, res) => {
    try {
        const birthCertificateData = req.body;
        const birthCertificate = new BirthCertificate(req.body);
        await birthCertificate.save();

        if (!birthCertificateData.name) {
            return res.status(400).json({ error: 'Missing required name field' });
        }
        if (!birthCertificateData.dateOfBirth) {
            return res.status(400).json({ error: 'Missing required date of birth field' });
        }
        if (!birthCertificateData.placeOfBirth) {
            return res.status(400).json({ error: 'Missing required place of birth field' });
        }
        if (!birthCertificateData.maidenName) {
            return res.status(400).json({ error: 'Missing required maiden name field' });
        }

        const pdfData = await generatePDF(birthCertificateData);

        if (pdfData) {
            const sanitizedName = birthCertificateData.name.replace(/ /g, '_');
            const filename = `${sanitizedName}.pdf`;
            const filePath = path.join(__dirname, filename);
            console.log('PDF Data:', pdfData);
            console.log('Filename:', filename);
            console.log('File Path:', filePath);
            console.log('Current Directory:', __dirname);

            try {
                fs.writeFileSync(filePath, pdfData);
                console.log('File written successfully');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

                const stream = fs.createReadStream(filePath);
                stream.pipe(res);
                stream.on('end', () => {
                    fs.unlinkSync(filePath);
                });
            } catch (err) {
                console.error('File writing failed:', err);
                res.status(500).json({ error: 'File writing failed' });
            }
        } else {
            res.status(500).json({ error: 'PDF generation failed' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}
);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});