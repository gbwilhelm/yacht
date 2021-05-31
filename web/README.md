# Create Self-Signed SSL Certificate

openssl req -nodes -new -x509 -keyout server.key -out server.cert

Note that this will cause a browser warning because it is self-signed. I will simply replace the cert files with a signed one later.

# Install Yarn and dependencies

yarn install

# Launch server

npm start or node server.js

On actual web server, the server will run as a Linux service using Forever.js

# Note

If running locally, use localhost in browser to navigate pages instead of running local .html files, as this prevents a CORS error when using back-end functionality. One must also place an SSL certificate in a directory called cert with the files server.key and server.cert in order to run https.
