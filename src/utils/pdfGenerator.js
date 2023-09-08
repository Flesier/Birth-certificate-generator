// A function to generate PDF certificates using pdfkit
const PDFDocument = require('pdfkit');


function generatePDF(birthCertificate) {
    const doc = new PDFDocument();

    //PDF content
    doc.fontSize(18).text('Birth Certificate', { align: 'center' });
    doc.fontSize(14).text(`Name: ${birthCertificate.name}`);
    doc.fontSize(14).text(`Date of birth: ${birthCertificate.dateOfBirth}`);
    doc.fontSize(14).text(`Place of birth: ${birthCertificate.placeOfBirth}`);
    doc.fontSize(14).text(`Maiden name: ${birthCertificate.maidenName}`);

    //will add more fields

    const pdfBuffer = [];
    doc.on('data', (chunk) => {
        pdfBuffer.push(chunk);
    });
    doc.on('end', () => {
        const pdfData = Buffer.concat(pdfBuffer);
    });


    return pdfData;
}

module.exports = generatePDF;