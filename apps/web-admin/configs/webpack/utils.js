const path = require('path');

function getRelativePath(rootPath) {
  return function fn(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [rootPath].concat(args));
  };
}

const getRootRelativePath = getRelativePath(path.resolve(__dirname, '../../'));

module.exports = {
  getRelativePath,
  getRootRelativePath,
};
