/* require module */
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

/* array of mime types */
var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "javascript": "text/javascript",
  "css": "text/css"
};

/* create server */
http.createServer((req, res) => {
  var uri = url.parse(req.url).pathname;
  var fileName = path.join(process.cwd(), unescape(uri));
  console.log("loading "+uri);
  var stats;

  try {
    stats = fs.lstatSync(fileName);
  } catch(e) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found');
    res.end();
    return;
  }

  /* check file/directory */
  if (stats.isFile()) { /* if file */
    var mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]]; /* get the extention file */
    res.writeHead(200, {'Content-Type': mimeType});

    var fileStream = fs.createReadStream(fileName); /* create a file */
    fileStream.pipe(res);
  } else if (stats.isDirectory()) { /* if directory */
    res.writeHead(302, { 'Location': 'index.html'});
    res.end();
  } else {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('500 Internal Server Error');
    res.end();
  }
}).listen(3000);
