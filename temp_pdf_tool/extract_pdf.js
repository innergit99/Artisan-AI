const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('../KDP_Research.pdf');

console.log('Type of pdf:', typeof pdf);
console.log('Keys of pdf:', Object.keys(pdf));
if (typeof pdf.default === 'function') {
    pdf.default(dataBuffer).then(function (data) {
        console.log(data.text);
    }).catch(err => {
        console.error('Error parsing PDF:', err);
    });
} else if (typeof pdf === 'function') {
    pdf(dataBuffer).then(function (data) {
        console.log(data.text);
    }).catch(err => {
        console.error('Error parsing PDF:', err);
    });
} else {
    console.error('pdf-parse did not export a function. Export:', pdf);
}
