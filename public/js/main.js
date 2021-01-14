const chatForm=document.getElementById("chat-form");
const chatMessages=document.querySelector(".chat-messages");
const roomName=document.getElementById("room-name");
const userList=document.getElementById("users");

const { username, room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});

const socket=io();

socket.on("roomusers",function({room,users}){
     outputRoomName(room);
     
     outputUsersName(users);
});
//console.log({username,room});
//Join Chat Room

socket.emit("joinroom",{username,room});

socket.on("message",function(message){

   outputMessage(message);
   chatMessages.scrollTop=chatMessages.scrollHeight;
});

chatForm.addEventListener("submit",function(e){
   e.preventDefault();

   //get message text
   const msg=e.target.elements.msg.value;

   //emit message to server

   socket.emit("chatMessage",msg);
   e.target.elements.msg.value="";
   e.target.elements.msg.focus();
});

function outputMessage(message){
    const div=document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector(".chat-messages").appendChild(div);
};

//Output Room Name
function outputRoomName(room){
     roomName.innerText=room;
}

function outputUsersName(users){
    
   // userList.innerHTML=`${users.map(user=>`<li>${user.username}</li>`).join('')}`

   userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
};