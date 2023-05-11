
//GET IP
async function getIP() {
  const response = await fetch('https://api.ipify.org?format=json');

  const json = await response.json();

  console.log(JSON.stringify(json.ip));

  document.getElementById("myip").innerHTML = json.ip;
  
}

//DEBUG TOOL
//in case you need to redo the api keys
function clearLocalStorage(){
    localStorage.clear();
}

//CHECK LOCALSTORAGE FOR API KEYS
//checks if the api keys already exist and displays a little message to show user that keys are needed
//shows a ! icon if it can't find api keys, and a checkmark if it does
function checkLocalStorage(){
    var weatherKey = localStorage.getItem("apiKeyWeather");
    var chatKey = localStorage.getItem("apiKeyChat");

    if(!weatherKey || !chatKey){
        console.log("Did not find an API key");
        document.getElementById("checksLocalStorage").innerHTML = "<i class='fa-solid fa-exclamation'></i>";
    }
    else{
        document.getElementById("checksLocalStorage").innerHTML = "<i class='fa-solid fa-check'></i>";
    }
}

//THIS IS A BUTTON THAT OPENS A PROMPT FOR API KEY FOR WEATHER AND CHAT, ASKING TO UPDATE KEY IF FOUND
var button = document.querySelector("button");

button.addEventListener("click", function(){
    //open prompt

    var weatherKey = localStorage.getItem("apiKeyWeather");
    if (!weatherKey) {
        weatherKey = prompt("Please enter Weather API key:")
        var weatherKey = localStorage.setItem("apiKeyWeather", weatherKey);
    }
    else{
        weatherKey = prompt("Please update Weather API key:", `${weatherKey}`);

        var weatherKey = localStorage.setItem("apiKeyWeather", weatherKey);
    }

    var chatKey = localStorage.getItem("apiKeyChat");
    if (!chatKey) {
        chatKey = prompt("Please enter Chat API key:")
        var chatKey = localStorage.setItem("apiKeyChat", chatKey);
    }
    else{
        chatKey = prompt("Please update Chat API key:", `${chatKey}`);

        var chatKey = localStorage.setItem("apiKeyChat", chatKey);
    }

});


//GET JOKES
async function getJokes(){ 

  const response = await fetch('https://official-joke-api.appspot.com/random_joke');
  const json = await response.json();
  console.log(JSON.stringify(json.setup));

  const joke = JSON.stringify(json.setup) + " " + JSON.stringify(json.punchline);

  document.getElementById("joke").innerHTML = joke;
}


//GET SUGGESTION FOR ACTIVITY
async function getBored(){
  const response = await fetch('https://www.boredapi.com/api/activity');
  const json = await response.json();
  const activity = JSON.stringify(json.activity);

  document.getElementById("bored").innerHTML = activity;
}


//LATITUDE AND LONGITUDE
     //GET LOCATION
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition);
       } else {
         document.getElementById("location").innerHTML =
         "Geolocation is not supported by this browser.";
       }

    let lat = "";
    let lon = "";
      
      function showPosition(position) {

        lat = position.coords.latitude;
        lon = position.coords.longitude;

        document.getElementById("location").innerHTML =
        "Latitude: " + position.coords.latitude + "<br>" +
        "Longitude: " + position.coords.longitude;

        //lat = position.coords.latitude;
        //lon = position.coords.longitude;
        console.log(lat + " " + lon);

        //GET WEATHER CALLED HERE
        //to make sure that lat and lon are properly set before weatherAPI is called
        getWeather();


        //return lat;
      }

//GET WEATHER FOR LAT AND LONG. TODO: ALSO ASKS FOR API KEY TO WEATHER MAP IF NO API KEY FOUND
async function getWeather(){

    var weatherKey = localStorage.getItem("apiKeyWeather");
    console.log(weatherKey);

    if(weatherKey != null){

        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&id=524901&appid=${weatherKey}&units=metric`);

        const json = await response.json();
      
        const weather = JSON.stringify(json);
        console.log(weather);
      
        const temp = JSON.stringify(json.main.temp);
        console.log(temp);

        const winds = JSON.stringify(json.wind.speed);
        console.log(winds);

        let city = JSON.stringify(json.name);
        console.log(city);
        city = city.replace(/["']/g, "");

        let icon = JSON.stringify(json.weather[0].icon);
        console.log(icon);

        icon = icon.replace(/["']/g, "");
        console.log(icon);

        document.getElementById("weathericon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      
        document.getElementById("weather").innerHTML = city +  "<br> Temperature: " + temp + "C. <br> Winds: " + winds + " m/s." ;
    }
    else{
        //wait for it? ask for it?
        //could just open another prompt
    }
}

//GET REPONSE FROM CHAT GPT
getChatGPT = async () => {

    if(localStorage.apiKeyChat){

        const question = document.getElementById("chat").value;
        console.log(question);
    
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question)
        };
        try {
            const fetchResponse = await fetch(`https://openai-ama-api-fw-teaching.rahtiapp.fi/?api_key=${localStorage.apiKeyChat}`, settings);
            //const fetchResponse = await fetch(`https://openai-ama-api-fw-teaching.rahtiapp.fi/?api_key=${localStorage.apiKeyChat}&simulation=1`, settings);
        
            const data = await fetchResponse.json();
            console.log(data);
            document.getElementById("chatResponse").innerHTML = data.answer;
            return data;
        } catch (e) {
            return e;
        }    
    
    }
    else{
        //ask for api key
    }

}

getIP();
checkLocalStorage();
getJokes();
getBored();


///NEXT IS TO DO STUFF

//get full list of ToDos
//displays title and details of todo entry
async function getTodoList(){
    const resp = await fetch("http://128.214.253.222:8371/todo");

    const respJson = await resp.json();

    console.log(respJson);

    for (entry of respJson.todo) {

        // let doneIcon = "Mark as done";
        // if(entry.done){
        //     doneIcon = "<i class='fa-solid fa-check'></i>"
        // }

        document.querySelector('ul').innerHTML += `
            <li>
            ${entry.title} <button id="doneToDo" onclick=editToDo('${entry.id}')>Update</button>
            <br>
            ${entry.info} <button id="deleteToDo" onclick=deleteToDo('${entry.id}')>x</button>
            <br>
            ${entry.due_date}
            <br>
            ${entry.done}
            </li>
        `;
    }
}

let editID = "";

async function editToDo(id){
    //gets a todo entry, and fills the text fields with the existing data

    editID = id;

    const resp = await fetch("http://128.214.253.222:8371/todo/" + id);

    const respJson = await resp.json();

    console.log(respJson.message.title);

    document.getElementById('title').value = respJson.message.title;
    document.getElementById('info').value = respJson.message.info;
    //document.getElementById('date').value = new Date();
    document.getElementById('done').value = respJson.message.done;

    document.getElementById('save-todo').style.display = "none";


    document.getElementById('update-todo').style.display = "block";




//     document.querySelector('title').innerHTML += `
//     <li>
//     ${respJson.message.title} <button id="doneToDo" onclick=doneToDo('${respJson.message.id}')>Update</button>
//     <br>
//     ${respJson.message.info} <button id="deleteToDo" onclick=editToDo('${respJson.message.id}')>x</button>
//     <br>
//     ${respJson.message.due_date}
//     <br>
//     ${respJson.message.done}
//     </li>
// `;
}

getTodoList();

async function newToDo(todo){

    const resp= await fetch("http://128.214.253.222:8371/todo", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(todo)
    })

    const respJSON = await resp.json();
    console.log(respJSON);

    window.location.reload();

}

async function deleteToDo(id){

    const urlstring = "http://128.214.253.222:8371/todo/" + id;
    console.log(urlstring);

    const resp= await fetch(urlstring, {
        method: 'DELETE',
    })

    const respJSON = await resp.json();
    console.log(respJSON);

    window.location.reload();

}

async function modToDo(todo){

    const urlstring = "http://128.214.253.222:8371/todo/" + editID;
    console.log(urlstring);

    console.log(JSON.stringify(todo));

    const resp= await fetch(urlstring, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(todo)
    })

    const respJSON = await resp.json();
    console.log(respJSON);

    window.location.reload();
}



document.querySelector('#save-todo').addEventListener('click', () => {
    const todo = {
            title: document.querySelector('#title').value,
            due_date: document.querySelector('#due-date').value,
            info: document.querySelector('#info').value
    }

    newToDo(todo);

    console.log(todo);
});




document.querySelector('#update-todo').addEventListener('click', () => {


    let boolString = document.querySelector("#done").value; 
    let boolValue = (boolString.toLowerCase() === "true"); 
    console.log(boolValue); // true

    console.log(document.querySelector('#title').value);
    console.log(document.querySelector('#due-date').value);

    console.log(document.querySelector('#info').value);



    const todo = {
            done: boolValue,
            title: document.querySelector('#title').value,
            due_date: document.querySelector('#due-date').value,
            info: document.querySelector('#info').value
    }

    console.log(todo);

    modToDo(todo);


});