const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

var cache = {};

function  send404 (res) {
  res.writeHead(404,{'Content-type':'text/plain'});
  res.write('Error 404:resource not found')
  res.end();
}

function  sendFile (res,filePath,fileContents) {
  res.writeHead(200,{'Content-type':mime.lookup(path.basename(filePath))});
  res.end(fileContents);
}

function  serveSatic (res,cache,absPath) {
  if(cache[absPath]){
    sendFile(res,absPath,cache[absPath]);
  }
  else{
    fs.exists(absPath, function(exists){
      if (exists) {
        fs.readFile(absPath,function(err,data){
          if (err) {
            send404(res);
          }
          else {
            cache[absPath] = data;
            sendFile(res,absPath,data);
          }
        })
      }
      else{
        send404(res);
      }
    });
  }
}

//传入回调函数处理请求
var server = http.createServer(function(req,res){
  var filePath = false;
  if (req.url == '/') {
    filePath = 'public/index.html';
  }
  else {
    filePath = 'public' + req.url;
  }
  var absPath = './' + filePath;
  serveSatic(res,cache,absPath);
})

server.listen(3001,function () {
  console.log("server listening on port 3001.");
})
