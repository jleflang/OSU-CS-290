// https://stackoverflow.com/questions/42372962/serving-pdf-content-back-to-browser-via-node-express-using-pdfmake

const PdfPrinter = require('pdfmake');

module.exports = (name, ticket, destination, depart) => {
    var fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
      }};

    var printer = new PdfPrinter(fonts);

    var docDef = {
        content: [
            'Oregon Premier Space Tours',
            {qr: ticket, fit: '250'},
            name,
            destination + " at " + depart,
        ],
        defaultStyle: {
            font: 'Helvetica'
        }
    };

    var doc = printer.createPdfKitDocument(docDef);

    return new Promise( function (resolve, reject) {
        try {
            var chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.end();
        } catch(error) {
            reject(error);
        }});
}