const path = require('path');
const fs = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

const getInfo = async () => {
  const content = await fs.readdir(pathToFolder);

  content.forEach(async (c) => {
    const stat = await fs.stat(path.join(pathToFolder, c));
    if(stat.isDirectory()) return;
    const name = path.basename(c, path.extname(c));
    const extname = path.extname(c).slice(1);
    const { size } = stat;
    console.log(`${name} - ${extname} - ${size}`);
  });
};

getInfo();
