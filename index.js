var args = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var path = require('path');
var dirs = require('./dirs');
var sys = require('sys')
var exec = require('child_process').exec;
var rmdir = require('rimraf');

switch(args._[0]) {
    case "cert":
        handleCert(args._[1], args);
        break;
    case "ca":
        handleAuthority(args._[1], args);
        break;
    default:
        break;
}

function handleCert(command, args) {
    switch(command) {
        case "list":
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
            break;
        case "create":
            if(!args.cn) {
                console.error("Missing CN for cert.");
                return;
            } else if(!args.name) {
                console.error("Missing cert name.");
                return;
            } else if(!args.ca) {
                console.error("Missing cert authority.");
                return;
            }

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
            break;
        case "delete":
            if(!args.name) {
                console.error("No cert to delete specified.");
                return;
            }

            var certDir = path.join(dirs.certsDir(), args.name);
            rmdir(certDir, function(err) {
                if(err) {
                    console.error("Issue removing cert:");
                    console.error(err);
                } else {
                    console.log("Removed cert " + args.name);
                }
            });
            break;
            break;
        default:
            console.log("Available commands: ");
            console.log("\t{list, create, delete}");
            break;
    }
}

function handleAuthority(command, args) {
    switch(command) {
        case "list":
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
            break;
        case "create":
            if(!args.cn) {
                console.error("Missing CN for authority.");
                return;
            } else if(!args.name) {
                console.error("Missing authority name.");
                return;
            }

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
            break;
        case "delete":
            if(!args.name) {
                console.error("No authority to delete specified.");
                return;
            }

            var caDir = path.join(dirs.casDir(), args.name);
            rmdir(caDir, function(err) {
                if(err) {
                    console.error("Issue removing authority:");
                    console.error(err);
                } else {
                    console.log("Removed authority " + args.name);
                }
            });
            break;
        default:
            console.log("Available subcommands: ");
            console.log("\t{list, create, delete}");
            break;
    }
}
