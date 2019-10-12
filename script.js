const socket = io('http://localhost:3000')  //where socket is hosting our app

const messageform = document.getElementById('form')
const messageInput = document.getElementById('input')
const messageContainer = document.getElementById('message-container')

socket.on('event_response',function(data) {
    // console.log(data);
    appendMessage(data);
})

socket.on('connect', function(data){
      socket.emit('new_connection',{name:"kwame"})
    console.log(data);
});

window.send = function(){
    var messageInput = document.getElementById('input');
    var name = document.getElementById('name');
    var data = messageInput.value;
    var name = name.value;
    socket.emit('event_msg',{name:name,data:data})  //sends message from the client to the server
    messageInput.value = ''
};

window.appendMessage = function(data)
{
    // console.log(data);
    messageContainer.append(data)
}
