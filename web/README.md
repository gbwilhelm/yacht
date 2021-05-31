# Create Self-Signed SSL Certificate

openssl req -nodes -new -x509 -keyout server.key -out server.cert

The server is configured to look for the server.key and server.cert files in a directory called cert, placed within this project's web directory.

# Install Dependencies via Yarn

yarn install

# Launch server

npm start or node server.js

On actual web server, the server runs as a reboot cron job using Forever.
