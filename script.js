function sendMsg(){

let name=

document.getElementById(
"name"
).value;


let email=

document.getElementById(
"email"
).value;


let message=

document.getElementById(
"message"
).value;


if(

name==""

||

email==""

||

message==""

)

{

alert(

"Fill all details"

)

}

else{

fetch(

"http://localhost:3000/contact",

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},

body:

JSON.stringify({

name,

email,

message

})

}

)

alert(

"Message Sent"

)

}

}


let btn=

document.getElementById(
"themeBtn"
)

btn.onclick=()=>{

document.body

.classList.toggle(

"dark"

)

}