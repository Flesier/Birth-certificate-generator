// A function to generate PDF certificates using pdfkit
const PDFDocument = require('pdfkit');


function generatePDF(birthCertificate) {
    
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({size: 'A5', margin: 50, layout: 'landscape'});
        /// Set the background color
        doc.rect(0, 0, doc.page.width, doc.page.height)
        .fillColor('#e5d3b3') // Change '#f0f0f0' to your desired background color
        .fill()

        const pdfBuffer = [];


        // Create a stroke (border) for margin
        // Create a smaller margin by reducing the values
        const marginX = 20;
        const marginY = 20;
        const marginWidth = doc.page.width - 2 * marginX;
        const marginHeight = doc.page.height - 2 * marginY;
        doc.strokeColor('#000000') // Set the stroke color (black in this example)
        .lineWidth(2) // Set the line width (2 points in this example)
        .rect(marginX, marginY, marginWidth, marginHeight) // Define a rectangle as the margin
        .stroke(); // Draw the stroke
        


        //doc.text('Birth Certificate', 100, 100);
        doc.fontSize(24)
        .addContent('Courier New')
        .text('', 100, 100, { align: 'center'})
        .fillColor('#ofofof')
        .fill()

        doc.fontSize(20)
        .addContent('Courier New')
        .text('Birth Certificate: ', 100, 130, { align: 'center' })
        .fillColor('#ofofof')
        .fill()



        doc.fontSize(24)
        .addContent('Times-Bold')
        .text(`Name : ${birthCertificate.name}`, 100, 170,{ align: 'center' })
        .fillColor('#ofofof')
        .fill()

        doc.fontSize(20)
        .addContent('Times-Bold')
        .text(`Date of birth: ${birthCertificate.dateOfBirth}`, 100, 220,{ align: 'center' })
        .fillColor('#ofofof')
        .fill()


        doc.fontSize(20)
        .addContent('Times-Bold')
        .text(`Place of birth: ${birthCertificate.placeOfBirth}`, 100, 270,{ align: 'center' })
        .fillColor('#ofofof')
        .fill()

        doc.fontSize(20)
        .addContent('Times-Bold')
        .text(`Maiden name: ${birthCertificate.maidenName}`, 100, 330,{ align: 'center' })
        .fillColor('#ofofof')
        .fill()

      
        
        /*PDF content
        doc.fontSize(18).text('Birth Certificate', { align: 'center' });
        doc.fontSize(14).text(`Name: ${birthCertificate.name}`);
        doc.fontSize(14).text(`Date of birth: ${birthCertificate.dateOfBirth}`);
        doc.fontSize(14).text(`Place of birth: ${birthCertificate.placeOfBirth}`);
        doc.fontSize(14).text(`Maiden name: ${birthCertificate.maidenName}`);
        */
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