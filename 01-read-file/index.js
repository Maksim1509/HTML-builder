const path = require('path');
const fs = require('fs');

const pathToText = path.join(__dirname, './text.txt');

const readableStream = fs.createReadStream(pathToText, 'utf-8');

readableStream.on('data', chunck => console.log(chunck));
