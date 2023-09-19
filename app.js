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

        // Check if all required fields are present in the request body
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

        // Generate the PDF certificate
        const pdfData = await generatePDF(birthCertificateData);

        if (pdfData) {
            // Create a valid filename by replacing spaces with underscores
            const sanitizedName = birthCertificateData.name.replace(/ /g, '_');
            const filename = `${sanitizedName}.pdf`;
            const filePath = path.join(__dirname, filename); // Use the current directory
            // Inside generatePDF function
            console.log('PDF Data:', pdfData);
            // Save the PDF data to the unique filename
            console.log('Filename:', filename);
            console.log('File Path:', filePath);
            console.log('Current Directory:', __dirname);

            // Save the PDF data to the unique filename
            try {
                fs.writeFileSync(filePath, pdfData);
                console.log('File written successfully');

                // Set response headers for a PDF file attachment
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

                // Read the file from the file system and pipe it to the response
                const stream = fs.createReadStream(filePath);
                stream.pipe(res);

                stream.on('end', () => {
                    // Clean up the temporary PDF file after it has been sent
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


// Routes
//const certificatesRouter = require('./src/routes/certificates.js');
//app.use('/certificates', certificatesRouter);


//starting server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});