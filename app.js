
var SocketIOFileUpload = require('socketio-file-upload');
var app = require('express')
.use(SocketIOFileUpload.router)
.use(app.static(__dirname + "/public"));
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs  = require('fs');
const port = 3000
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function(){
    console.log(`listening on port: ${port}`);
  });

var connections = [];

io.on('connection', function(socket){
  console.log('a user connected'); 
  //first message sent to confirm if client can receive message
  socket.emit('event_response',"Welcome!");
  //on new_connection extablished
  //store the connection channel in an array agaist the user name
  socket.on('new_connection', data =>{
    for(var i=0;i<connections.length;i++) {
      //if connection has already been stored for the user
      //return user already registered
      if(connections[i].name === data.name){
        return console.log("user already registered");
      }
    } 
    //store the connection for 
    //the user since the current connection has not been found
    connections.push({name:data.name,con:socket});
    console.log('user stored'); 
  });
  //handling for message event   
  socket.on('event_msg',data =>{
    console.log(data);
    //loop through the connection array to get user connection channel
    //and send the info to that user only
    for(var i=0;i<connections.length;i++) {
      //if the stored connection matches the receiver's connection
      // forward the message to the user
      if(connections[i].name === data.name){
        console.log("msg forwarded");
        connections[i].con.emit('event_response',data);
        socket.emit('event_msg',{data:data});
        return false;
      }else{
        connections[i].con.emit('event_response',"not sent");
      }
      
    }
  })
});

//instance of SocketIOFileUpload
var uploader = new SocketIOFileUpload();
uploader.dir = "C:\Users/user/Documents/vokacom";
uploader.listen(socket);

//when file is saved, do this
uploader.on("saved",function(event){
  console.log(event.file);
});
//error handler
uploader.on("error",function(event){
  console.log("Error from uploader",event);
});