const path = require('path');
const fs = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');


const pathToStyles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'style.css');

const copy = async (from, to) => {
  // try {
  //   await fs.rm(to, { recursive: true });
  // } catch (e) {
  //   // to do
  // }

  await fs.mkdir(to, { recursive: true });
  const files = await fs.readdir(from);
  files.forEach(async (f) => {
    await fs.copyFile(path.join(from, f), path.join(to, f));
  });
};

const getPath = (...name) => path.join(__dirname, ...name);

const insertComponent = (html, target, component) => {

  const targetWrap = `{{${target}}}`;
  const targetLength = targetWrap.length;

  const startIndex = html.indexOf(targetWrap);
  const endIndex = startIndex + targetLength;

  const res = `${html.slice(0, startIndex)}${component}${html.slice(endIndex)}`;
  return res;
};

const build = async () => {
  try {
    await fs.rm(getPath('project-dist'), { recursive: true });
  } catch (e) {
    // to do
  }

  await fs.mkdir(getPath('project-dist'), { recursive: true });
  try {
    const componetsDir = await (await fs.readdir(getPath('components'), { withFileTypes: true }));
    let temp = await fs.readFile(getPath('template.html'), 'utf-8');
    const promises = componetsDir.map(async ({ name }) => {
      const content = await fs.readFile(getPath('components', name), 'utf-8');
      temp = insertComponent(temp, path.basename(name, path.extname(name)), content);
    });
  
    Promise.all(promises).then(() => fs.writeFile(getPath('project-dist', 'index.html'), temp));
  } catch (e) {
    await fs.copyFile(getPath('template.html'), getPath('project-dist', 'index.html'));
  }
};

const copyAssets = async () => {
  try {
    const assetsDir = await fs.readdir(getPath('assets'));
    await fs.mkdir(getPath('project-dist', 'assets'), { recursive: true });
    for (const asset of assetsDir) {
      const from = getPath('assets', asset);
      const to = getPath('project-dist', 'assets', asset);
      await copy(from, to);
    }
  } catch (error) {
    // to do
  }
};

const styleMerge = async () => {
  try {
    const files = await fs.readdir(pathToStyles, { withFileTypes: true });
    const names = files.filter((f) => f.isFile() && path.extname(f.name) === '.css')
      .map(({ name }) => name);
    const rs = names.map((name) => createReadStream(path.join(pathToStyles, name), 'utf-8'));
    const ws = createWriteStream(path.join(pathToBundle), 'utf-8');
    rs.forEach((s) => {
      s.on('data', data => ws.write(data));
    });    
  } catch (error) {
    // to do
  }
};

(async() => {
  try {
    await fs.stat(getPath('template.html'));
  } catch {
    console.log('\nДобавьте фаил template.html\n');
    return;
  }
  await build();
  await copyAssets();
  await styleMerge();
})().catch((e) => console.log('Что-то пошло не так, попробуйте еще раз\n', e.message));
