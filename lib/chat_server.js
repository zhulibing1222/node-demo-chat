var socketio = require('sockt.io');
var io;
var guesetNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
  io = socketio.listen (server);
  io.set('log level',1)
  io.sockets.on('connection',function (socket) {
    guesetNumber = assignGuestName(socket, guesetNumber,nickNames,namesUsed);
    joinRoom(socket,'Lobby');
    handleMessageBroadcasting(socket,nickNames);
    handleNameChangeAttempts(socket,nickNames,namesUsed);
    handleRoomJoining(socket);
    socket.on('rooms',function(){
      socket.emit('rooms',io.sockets.manager.rooms);
    });
    handleClientDisconnection(socket,nickNames,namesUsed);
  });
}

function assignGuestName(socket,guesetNumber, nickNames, namesUsed) {
  var name = 'Guest' + guesetNumber;
  nickNames[socket.id] = name;
  socket.emit('nameResult',{
    success:true,
    name:name
  });
  namesUsed.push(name);
  return guesetNumber + 1;
}

function joinRoom(socket, room) {
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.emit('joinResult',{room:room});
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  });

  var usersInRoom = io.sockets.clients(room);
  if (usersInRoom.length > 1) {
    var usersInRoomSummary = 'Users currently in ' + room +': ';
    for (var index in usersInRoom) {
      
    }
  }

  function handleNameChangeAttempts(socket,nickNames,namesUsed) {
    socket.on('nameAttempt',function (name) {
      if (name.startsWidth('Guest')){
        socket.emit('nameResult', {
          success:false,
          message:'Names cannot begin with "Guest".'
        })
      }
    })
  }
}


