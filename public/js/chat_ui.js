let messageEl = document.querySelector('.left');
let head = document.querySelector('header');
let roomList = document.querySelector('.right');
let btn = document.querySelector('button');
let input = document.querySelector('input');

function appendDiv (el,mes,tag='div') {
  var child = document.createDocumentFragment(tag)
  child.innerHTML = mes;
  el.appendchild(child);
}

let socket = io.connect();
let chatApp = new Chat(socket);

socket.on('nameResult', function (result) {
  let massage;

  if (result.success) {
    massage = `You are now known as ${result.name}.`
  }
  else {
    message = result.message;
  }
  appendDiv(messageEl,message);
});

socket.on('joinResult',function (result) {
  roomEl.innerText = result.room;
  chatApp.curRoom = result.room;
  appendDiv(messageEl,'Room changed.');
});

socket.on('massage', function(message){
  appendDiv(messageEl,message.text);
})

socket.on('rooms',function(rooms) {
  roomList.innerHTML = '';
  for (let room in rooms) {
    room = room.substring(1,room.length);
    if (room != '') {
      appendDiv(roomList,room)
    }
  }
})

roomList.addEventListener('click', function (e) {
  if(e.target.nodeName == 'li'){
    chatApp.changeRoom(e.target.innerText);
  }
})

button.addEventListener('submit', function (e) {
  let text = input.value;
  if(!text){
    return;
  }
  if(text.charAt('0') == '/') {
    let mes = chatApp.processCommand(text);
    if(mes){
      appendDiv(messageEl,mes);
    }
  }
  else{
    chatApp.sendMessage(chatApp.curRoom, text);
    appendDiv(messageEl,text);
  }
  input.value = '';
})
