var fs = require('fs');
var path = require('path');
var dirs = require('./dirs');
var sys = require('sys')
var exec = require('child_process').exec;
var rmdir = require('rimraf');

var CertManager = {};

CertManager.listAuthorities = function() {
    fs.readdir(dirs.casDir(), function(err, files) {
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

CertManager.createAuthority = function(inCN, inName) {
    dirs.checkMainDir();
    var caDir = path.join(dirs.casDir(), args.name);
    if(fs.existsSync(caDir)) {
        console.error("Such an authority already exists.");
        return;
    }
    var keyFile = path.join(caDir, 'authority.key');
    var cerFile = path.join(caDir, 'authority.cer');
    fs.mkdirSync(caDir);
    exec('openssl genrsa -out ' + keyFile + ' 2048', function(err) {
        exec('openssl req -x509 -new -key ' + keyFile + ' -out ' + cerFile + ' -days 730 -subj /CN="' + args.cn + '"', function(err) {
            console.log("Created authority " + args.name);
        });
    });
};

CertManager.deleteAuthority = function(inName) {
    var caDir = path.join(dirs.casDir(), args.name);
    rmdir(caDir, function(err) {
        if(err) {
            console.error("Issue removing authority:");
            console.error(err);
        } else {
            console.log("Removed authority " + args.name);
        }
    });
};


CertManager.listCerts = function() {
    fs.readdir(dirs.casDir(), function(err, files) {
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

CertManager.createCert = function(inCN, inName, inCA) {
    dirs.checkMainDir();
    var certDir = path.join(dirs.certsDir(), args.name);
    if(fs.existsSync(certDir)) {
        console.error("Such a certificate already exists.");
        return;
    }
    var keyFile = path.join(certDir, 'certificate.key');
    var reqFile = path.join(certDir, 'certificate.req');
    var cerFile = path.join(certDir, 'certificate.cer');
    var serialFile = path.join(certDir, 'serial');
    var caDir = path.join(dirs.casDir(), args.ca);
    var caKeyFile = path.join(caDir, 'authority.key');
    var caCertFile = path.join(caDir, 'authority.cer');
    fs.mkdirSync(certDir);
    exec('openssl genrsa -out ' + keyFile + ' 2048', function(err) {
        exec('openssl req -new -key ' + keyFile + ' -out ' + reqFile + ' -subj /CN="' + args.cn + '"', function(err) {
            exec('openssl x509 -req -in ' + reqFile + ' -out ' + cerFile + ' -CAkey ' + caKeyFile + ' -CA ' + caCertFile + ' -days 365 -CAcreateserial -CAserial ' + serialFile, function(err) {
                console.log("Created certificate " + args.name);
            });
        });
    });
};

CertManager.deleteCert = function(inName) {
    var certDir = path.join(dirs.certsDir(), args.name);
    rmdir(certDir, function(err) {
        if(err) {
            console.error("Issue removing cert:");
            console.error(err);
        } else {
            console.log("Removed cert " + args.name);
        }
    });
};

module.exports = CertManager;
