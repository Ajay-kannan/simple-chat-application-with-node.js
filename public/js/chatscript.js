
    const socket = io();    
    // const chatMess = document.getElementsByClassName("send");
    const chatBox = document.getElementsByClassName("chatbox");
    const myButton = document.getElementById('finduser');


    let friend;
    
    function getfriend() {
    friend =  document.getElementById("findvalue").value;
    console.log("Stored Input: ", friend);
    socket.emit("friendname",friend);

  }

    let username;
    window.onload = function() {
        setTimeout(function() {
          username = document.getElementById("username").innerText;
         console.log(username)
        }, 500); 
      };
    
    
// output message

function outputmessage(name,message)
{
  
  const div = document.createElement("div");
  const p = document.createElement("p");
  p.innerHTML = `<h4> ${name} - &nbsp &nbsp &nbsp</h4>`;
  p.innerText += message;
  p.style.padding = "10px";

  p.style.margin = "10px";

  div.appendChild(p);
  div.style.background = "#7386ff";
  document.querySelector(".message").appendChild(div);
 
 
  // console.log(chatBox.scrollHeight);
  // chatBox.scrollTop += 10;

}

socket.on("revmessage",(msg) =>{
  outputmessage(friend,msg);
});

function chatmess() {
  // e.preventDefault();
  let msg = document.getElementById("valueName").value;

  if(!msg)
  {
    return false;
  }
  
  socket.emit("message",msg);
  
// document.getElementById("valueName").value = "";
  outputmessage(username,msg);

  // e.target.elements.valueName.value = '';
  // e.target.elements.valueName.focus();
}
