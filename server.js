var app = require('express')(),
    server = require('http').createServer(app), 
    io = require('socket.io').listen(server),
    zmq = require('zmq');

io.configure(function(){
  io.set('log level', 1);
})

server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

  var listener = zmq.socket('sub');
  listener.connect('tcp://127.0.0.1:3000');
  listener.subscribe("data")
  listener.on("message", function(message) {
    console.log("listened:" + message);
    socket.emit('zmq', message.toString("ascii"));
  });

});


// emitter.

sock = zmq.socket('pub');

sock.bindSync('tcp://127.0.0.1:3000');

setInterval(function() {
  var data = {
    "topic" : "news",
    "title" : "River wins local championship.",
    "body"  : "Loren ipsum, we're champions fuck everyone else."
  }
  console.log("seding stuff")
  sock.send(["data", JSON.stringify(data)]);
}, 100);