var fs = require('fs');
var path = require('path');

var dirs = {};

dirs.checkMainDir = function checkMainDir() {
    if(!fs.existsSync(dirs.baseDir())) {
        fs.mkdirSync(dirs.baseDir());
        fs.mkdirSync(dirs.casDir());
        fs.mkdirSync(dirs.certsDir());
        return true;
    }

    if(!fs.existsSync(dirs.casDir())) {
        fs.mkdirSync(dirs.casDir());
    }

    if(!fs.existsSync(dirs.certsDir())) {
        fs.mkdirSync(dirs.certsDir());
    }

    return true;
}

dirs.homeDir = function homeDir() {
    return process.env['HOME']
}

dirs.baseDir = function baseDir() {
    return path.join(dirs.homeDir(), '.certs');
}

dirs.casDir = function casDir() {
    return path.join(dirs.baseDir(), 'ca');
}

dirs.certsDir = function certsDir() {
    return path.join(dirs.baseDir(), 'cert');
}

module.exports = dirs;
