const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// connect to the database-MongoDB
mongoose.connect('mongodb://localhost/birthCertificates', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Routes
const certificatesRouter = require('./src/routes/certificates');

//starting server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});