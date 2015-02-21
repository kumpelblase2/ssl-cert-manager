# SSL-Manager

Manage your self-signed SSL-certificates and authorities with ease.

## Available commands
### ssl-manager ca
#### ssl-manager ca create
Creates a new authority for your to use.
Params:
  * --name=<ca-name>: Name of the authority. This is for referencing it inside the application and the local folder name
  * --cn=<cn>       : CN name for the authority in the certificate itself
  
#### ssl-manager ca list
Lists all your created authorities

#### ssl-manager ca delete
Deletes an authority by the name you've chosen when creating it.
Params:
  * --name=<ca-name>: Name of the authority
  
### ssl-manager cert
#### ssl-manager cert create
Creates a new certificate for your to use.
Params:
  * --name=<cert-name>: Name of the certificate. This is for referencing it inside the application and the local folder name
  * --cn=<cn>       : CN name in the certificate itself
  * --ca=<ca-name>: Name of the authority to use for signing this certificate. This needs to be an authority which was created with this tool
  
#### ssl-manager cert list
Lists all your created certificates

#### ssl-manager cert delete
Deletes a certificate by the name you've chosen when creating it.
Params:
  * --name=<cert-name>: Name of the certificate
  
## Storage info
By default, the application stores the authorities under `~/.certs/ca` and the certificates under `~/.certs/cert`
  
## Installation
It's distributed via NPM so you can install it via:
```
npm install -g ssl-manager
````
You may want to omit `-g` if you don't want to install it in the global namespace.

## Uninstall
````
npm uninstall -g ssl-manager
```
To also remove all the authorities and certificates created by this tool, just delete the `.certs` directory inside you home directory.
