const { imageSize: sizeOf } = require('image-size');
const path = require('path');
const fs = require('fs');

const p_image = '/images/products/A-TELA-CAJ.jpg';
const imgPath = path.join(__dirname, 'public', p_image);

console.log('Testing path:', imgPath);
console.log('Exists:', fs.existsSync(imgPath));

try {
    const dimensions = sizeOf(imgPath);
    console.log('Dimensions:', dimensions);
} catch (e) {
    console.error('Error:', e.message);
    console.error('Stack:', e.stack);
}
