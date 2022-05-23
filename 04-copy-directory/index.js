const path = require('path');
const fs = require('fs/promises');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

const copy = async (from, to) => {
  try {
    await fs.rm(to, { recursive: true });
  } catch (e) {
    // to do
  }

  await fs.mkdir(to, { recursive: true });
  const files = await fs.readdir(from);
  files.forEach(async (f) => {
    await fs.copyFile(path.join(from, f), path.join(to, f));
  });
  console.log('Files copied successfully');
};

copy(srcPath, destPath);
