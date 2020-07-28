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
  let stat;
  fs.readdirSync(from).forEach(function(element){
    stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(path.join(from, element)), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
    stat = null;
  });
}


function build(){
  copyFolderSync(app, cwd + '/app');
  copyFolderSync(base, cwd + '/app/modules');
  fs.copyFileSync(dir + '/build/index.html', cwd + '/index.html');
}


module.exports = { build }
