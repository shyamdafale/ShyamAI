const fs = require('fs');
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8BHna6DwcAAAAASUVORK5CYII=';
const buffer = Buffer.from(pngBase64, 'base64');
fs.writeFileSync('icons/icon48.png', buffer);
fs.writeFileSync('icons/icon128.png', buffer);
console.log('png files written');
