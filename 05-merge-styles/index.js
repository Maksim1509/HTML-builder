const path = require('path');
const fs = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');


const pathToStyles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');

const styleMerge = async () => {
  const files = await fs.readdir(pathToStyles, { withFileTypes: true });
  const names = files.filter((f) => f.isFile() && path.extname(f.name) === '.css')
    .map(({ name }) => name);
  const rs = names.map((name) => createReadStream(path.join(pathToStyles, name), 'utf-8'));
  const ws = createWriteStream(path.join(pathToBundle), 'utf-8');
  rs.forEach((s) => {
    s.on('data', data => ws.write(data));
  });
};

styleMerge();
