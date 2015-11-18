var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var rmdir = require('rimraf');

function CertManager(inBaseDir) {
    this.baseDir = inBaseDir || path.join(process.env['HOME'], '.certs');
    this.caDir = path.join(this.baseDir, 'ca');
    this.certDir = path.join(this.baseDir, 'cert');
};

CertManager.prototype.checkMainDir = function() {
    if(!fs.existsSync(this.baseDir)) {
        fs.mkdirSync(this.baseDir);
        fs.mkdirSync(this.caDir);
        fs.mkdirSync(this.certDir);
        return true;
    }

    if(!fs.existsSync(this.caDir)) {
        fs.mkdirSync(this.caDir);
    }

    if(!fs.existsSync(this.certDir)) {
        fs.mkdirSync(this.certDir);
    }

    return true;
};

CertManager.prototype.listAuthorities = function() {
    fs.readdir(this.caDir, function(err, files) {
        if(!err && files && files.length > 0) {
            console.log('Available Authorities:');
            files.forEach(function(ca) {
                console.log('\t' + ca);
            });
        } else {
            console.log('Could not find any authorities.');
        }
    });
};

CertManager.prototype.createAuthority = function(inCN, inName) {
    this.checkMainDir();
    var caDir = path.join(this.caDir, inName);
    if(fs.existsSync(caDir)) {
        console.error("Such an authority already exists.");
        return;
    }
    var keyFile = path.join(caDir, inName + '.key');
    var cerFile = path.join(caDir, inName + '.cer');
    fs.mkdirSync(caDir);
    exec('openssl genrsa -out ' + keyFile + ' 4096', function(err) {
        exec('openssl req -x509 -new -key ' + keyFile + ' -out ' + cerFile + ' -days 730 -subj /CN="' + inCN + '"', function(err) {
            console.log("Created authority " + inName);
        });
    });
};

CertManager.prototype.deleteAuthority = function(inName) {
    var caDir = path.join(this.caDir, inName);
    rmdir(caDir, function(err) {
        if(err) {
            console.error("Issue removing authority:");
            console.error(err);
        } else {
            console.log("Removed authority " + inName);
        }
    });
};


CertManager.prototype.listCerts = function() {
    fs.readdir(this.certDir, function(err, files) {
        if(!err && files && files.length > 0) {
            console.log('Available certificates:');
            files.forEach(function(cert) {
                console.log('\t' + cert);
            });
        } else {
            console.log('Could not find any certificates.');
        }
    });
};

CertManager.prototype.createCert = function(inCN, inName, inCA) {
    this.checkMainDir();
    var certDir = path.join(this.certDir, inName);
    if(fs.existsSync(certDir)) {
        console.error("Such a certificate already exists.");
        return;
    }
    var keyFile = path.join(certDir, inName + '.key');
    var reqFile = path.join(certDir, inName + '.req');
    var cerFile = path.join(certDir, inName + '.cer');
    var serialFile = path.join(certDir, 'serial');
    var caDir = path.join(this.caDir, inCA);
    var caKeyFile = path.join(caDir, inCA + '.key');
    var caCertFile = path.join(caDir, inCA + '.cer');
    fs.mkdirSync(certDir);
    exec('openssl genrsa -out ' + keyFile + ' 4096', function(err) {
        exec('openssl req -new -key ' + keyFile + ' -out ' + reqFile + ' -subj /CN="' + inCN + '"', function(err) {
            exec('openssl x509 -req -in ' + reqFile + ' -out ' + cerFile + ' -CAkey ' + caKeyFile + ' -CA ' + caCertFile + ' -days 365 -CAcreateserial -CAserial ' + serialFile, function(err) {
                console.log("Created certificate " + inName);
            });
        });
    });
};

CertManager.prototype.deleteCert = function(inName) {
    var certDir = path.join(this.certDir, inName);
    rmdir(certDir, function(err) {
        if(err) {
            console.error("Issue removing cert:");
            console.error(err);
        } else {
            console.log("Removed cert " + inName);
        }
    });
};

module.exports = CertManager;
