const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const birthCertificate = require('../models/birthCertificate.js');
const generatePDF = require('../utils/pdfGenerator.js');

// create a birth certficate
router.post(
    '/',
    [
        check('name', 'Name required').not().isEmpty(),
        check('dateOfBirth', 'Date of birth required').isDate(),
        check('placeOfBirth', 'Place of birth required').not().isEmpty(),
        check('maidenName', 'Maiden name required').not().isEmpty(),
    ],
    async (req, res) => {
        try {
            // validates input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // creates a new birth certificate
            const { name, dateOfBirth, placeOfBirth } = req.body;
            const newCertificate = new BirthCertificate({
                name,
                dateOfBirth,
                placeOfBirth,
                maidenName: req.body.maidenName,
            });

            // saves the new birth certificate to the database
            await newCertificate.save();

            // generates a PDF
            const pdf = generatePDF(newCertificate);

            // sends the PDF as a response
            res.status(201).json({ certificate: newCertificate, pdf });
        } catch (error) {
            console.error(error);
            res.status(500).json({ errors: [{ message: 'Server error' }] });
        }
    }

);

// get all birth certificates by ID
router.get('/:id', async (req, res) => {
    try {
        const certificate = await BirthCertificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ errors: [{ message: 'Certificate not found' }] });
        }

        res.status(200).json(certificate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: 'Server error' }] });
    }
});

module.exports = router;