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
