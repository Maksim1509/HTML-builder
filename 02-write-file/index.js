const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({ input, output });

const ws = fs.createWriteStream(path.join(__dirname, 'text.txt'));

rl.question('Hello, input some text, pls.\n', (text) => {
  ws.write(text);
});

rl.on('line', (text) => {
  if (text === 'exit') {
    rl.close();
    return;
  } 
  ws.write('\n' + text);
});

rl.on('close', () => console.log('Thank you, Bye!'));
