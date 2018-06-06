import path from 'path';
import express from 'express';
import http from 'http'

const PORT = 3000;
const VERSION = '0.1.0';
const app = express();

//Serving the files on the dist folder
app.use(express.static(__dirname));

/** Create HTTP server. */
const server = http.createServer(app);

//Send index.html when the user access the web
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});


/** Finally let's serve on specified port */
server.listen(PORT, err => {
  if (err) {
    return console.log('something bad happened', err);
  }

	console.log(`Frontend version ${VERSION} started on port ${PORT}`);
});
