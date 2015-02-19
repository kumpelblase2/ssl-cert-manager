var args = require('minimist')(process.argv.slice(2));
var manager = require('./manager');

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
            manager.listCerts();
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

            manager.createCert(args.cn, args.name, args.ca);
            break;
        case "delete":
            if(!args.name) {
                console.error("No cert to delete specified.");
                return;
            }

            manager.deleteCert(args.name);
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
            manager.listAuthorities();
            break;
        case "create":
            if(!args.cn) {
                console.error("Missing CN for authority.");
                return;
            } else if(!args.name) {
                console.error("Missing authority name.");
                return;
            }

            manager.createAuthority(args.cn, args.name);
            break;
        case "delete":
            if(!args.name) {
                console.error("No authority to delete specified.");
                return;
            }

            manager.deleteAuthority(args.name);
            break;
        default:
            console.log("Available subcommands: ");
            console.log("\t{list, create, delete}");
            break;
    }
}
