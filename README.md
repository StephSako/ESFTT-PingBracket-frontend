# PingBracket

## Déploiement

ssh pi@192.168.1.16

sudo apt update && sudo apt -y upgrade
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install 12.13.0
npm install -g npm@8.3.0
npm install -g @angular/cli@10.1.7
[LOCAL FRONT] ng build --prod
[LOCAL FRONT] scp -r ./dist/ping-bracket pi@192.168.1.16:~/Documents/ping-bracket-frontend
[PI FRONT] sudo cp ~/Documents/ping-bracket-frontend/* /var/www/html/
[LOCAL BACK] scp -r ./controller ./middleware ./model ./routes .env package.json server.js pi@192.168.1.16:~/Documents/ping-bracket-backend
[PI BACK] npm i
[PI BACK] npm install -g pm2
[PI BACK] pm2 start server.js
[PI BACK] sudo nano /etc/apache2/sites-available/000-default.conf
	-> Ajouter ProxyPass / http://localhost:3000/
[PI BACK] systemctl restart apache2
[PI BACK] cd /etc/apache2/sites-enabled
[PI BACK] sudo a2enmod (prompt : 'proxy' et 'proxy_http')
[PI BACK] sudo systemctl reload apache2
[PI BACK] sudo systemctl stop apache2
[PI BACK] sudo systemctl start apache2

--------
sudo service apache2 restart
