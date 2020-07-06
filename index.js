const fs = require('fs'),
path = require('path'),
cwd = process.cwd()

let dir = __dirname,
app = dir + '/build/app',
base = dir + '/lib';


function copyFolderSync(from, to) {
  try {
    fs.mkdirSync(to);
  } catch(e) {}

  fs.readdirSync(from).forEach((element) => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(path.join(from, element)), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}


function build(){

  copyFolderSync(app, cwd + '/app');
  copyFolderSync(base, cwd + '/app/jsnode');
  fs.copyFileSync(dir + '/build/index.html', cwd + '/index.html');

}


module.exports = { build }
