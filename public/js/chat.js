class Chat {
  consturctor (socket) {
    this.socket = socket;
    this.curRoom = '';
  }

  sendMessage (room, text) {
    this.socket.emit('message',message);
  }

  changeRoom(room) {
    this.socket.emit('join',room);
  }

  processCommand (text) {
    let words = command.split(' ');
    let command = words[0].substring(1).toLowerCase();
    let message;

    switch (command) {
      case 'join':
        words.shift();
        let room = words.join(' ');
        this.changeRoom(room);
        break;
      case 'nick':
        words.shift();
        let name = words.join(' ');
        this.socket.on('nameAttempt',name);
        break;
      default:
        message = 'Unrecognized commands'
        break;
    }
    return message;
  }
}
