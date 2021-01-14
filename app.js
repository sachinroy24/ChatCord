const express=require("express");
const http=require("http");
const path=require("path");
const socketio=require("socket.io");
const formatMessage=require("./utils/messages.js");
const {userJoin, getCurrentUser,userLeave,getRoomUsers}=require("./utils/user.js");
const app=express();
const server=http.createServer(app);
const io=socketio(server);

//set static folder
app.use(express.static(path.join(__dirname,"public")));

const botName="Chatcord Bot";

//run when client connects
io.on("connection",socket =>{

    socket.on("joinroom",function({username,room}){
        const user=userJoin(socket.id,username,room);

        socket.join(user.room);
         //Welcome current User
     socket.emit("message",formatMessage(botName,"Welcome to Chatcord"));

     // Notify other users

     socket.broadcast.to(user.room).emit("message",formatMessage(botName,`${username} has joined the chat`));
     io.to(user.room).emit("roomusers",{
         room: user.room,
         users: getRoomUsers(user.room)
     });
    });
     
    

     //Listen for chat message
    
     socket.on("chatMessage",function(msg){
        const user=getCurrentUser(socket.id);
         io.to(user.room).emit("message",formatMessage(user.username,msg));
     });

      //run this function when the client disconnects
      socket.on("disconnect",function(){
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message",formatMessage(botName,`${user.username} has left the chat.`));
            io.to(user.room).emit("roomusers",{
                room: user.room,
                users: getRoomUsers(user.room)
            });
       
        };
        
       
    });
});

server.listen(process.env.PORT||3000,function(){
    console.log("The server has been started.");
});