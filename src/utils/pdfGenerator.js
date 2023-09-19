// A function to generate PDF certificates using pdfkit
const PDFDocument = require('pdfkit');


function generatePDF(birthCertificate) {
    
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const pdfBuffer = [];

        //PDF content
        doc.fontSize(18).text('Birth Certificate', { align: 'center' });
        doc.fontSize(14).text(`Name: ${birthCertificate.name}`);
        doc.fontSize(14).text(`Date of birth: ${birthCertificate.dateOfBirth}`);
        doc.fontSize(14).text(`Place of birth: ${birthCertificate.placeOfBirth}`);
        doc.fontSize(14).text(`Maiden name: ${birthCertificate.maidenName}`);
        
        doc.on('data', (chunk) => {
            pdfBuffer.push(chunk);
        });

        doc.on('end', () => {
            const pdfData = Buffer.concat(pdfBuffer);
            resolve(pdfData);
        });

        // Handle errors during PDF generation
        doc.on('error', (err) => {
            reject(err);
        });

        doc.end(); // Finalize the PDF generation
    });
}
module.exports = generatePDF;