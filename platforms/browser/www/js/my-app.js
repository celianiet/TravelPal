// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    getLocation();   
    
});


// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;
})


$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    })

//====Start My Location and Opencage====

var currency;
var city;
var latitude;
var longitude;

function getLocation(){
    navigator.geolocation.getCurrentPosition(geoCallback, onError);
}

var geoCallback = function(position){
    console.log(position);

    latitude = position.coords.latitude;;
    longitude = position.coords.longitude;
    openCage();
    getWeather();
}

function onError(message){

    console.log(message);

}


//Creating the variable and request
function openCage() {
    var http = new XMLHttpRequest();
    var api_key = '3f583365eb344190995625c2a6e06fec';
    var api = 'https://api.opencagedata.com/geocode/v1/json';

//declaration of variable url to get the data
var url = api
  + '?'
  +'&key='+encodeURIComponent(api_key)
  + '&q=' +encodeURIComponent(latitude)
  + ',' +encodeURIComponent(longitude)
  + '&pretty=1';

    http.open("GET", url);
    
    //function
    http.onreadystatechange = (e)=>{
        if (http.readyState === 4 && http.status === 200){
        var response = http.responseText;
        var responseJSON = JSON.parse(response);
    
        console.log(responseJSON);
    
        city = responseJSON.results[0].components.city;
        var country = responseJSON.results[0].components.country;
        var currencyName = responseJSON.results[0].annotations.currency.name;
        var currencyCode = responseJSON.results[0].annotations.currency.iso_code;
        //console.log(flagCode); 
        console.log(currencyCode); 
        currency = currencyCode; 
        console.log(currency);

        var location = "Country: " + country;
        document.getElementById('city').innerHTML = city;
        document.getElementById('openCage').innerHTML = location;
        document.getElementById('currency').innerHTML = currencyName;

        getRate();
    }};
    http.send();
    
}

//=== end Location and OpenCage Functions===//

//===Start converter function ====//
var rate;

function getRate(){

    var http = new XMLHttpRequest();

    const url = 'http://apilayer.net/api/live?access_key=251cc43edc0060a55fe492f1adbc3601';
    
    http.open("GET", url);
    
    http.onreadystatechange = (e) => {
        if (http.readyState === 4 && http.status === 200){
        var response = http.responseText;
        var responseJSON = JSON.parse(response); 
    
        console.log(responseJSON);
        console.log(currency);

        var dollar = "USD";
        var curr = dollar + currency;

        console.log(curr);

        rate = responseJSON.quotes[curr];

        console.log("rate "+rate);
    }};
    http.send();
}

// Converting in one direction
function dollarToCurrency(){
 
    var inputDollar = document.getElementById('input').value;
    console.log(inputDollar);

    if(inputDollar>0) {
    var result = (inputDollar * rate).toFixed(2);
    document.getElementById('result').innerHTML = result;
    }else{
        var message = "Please, insert a valid number"
        document.getElementById('result').innerHTML = message;
    }

}

// Converting in the other direction
function currencyToDollar(){

    inputCurrency = document.getElementById('inputCurrency').value;
    console.log(inputCurrency);

    if(inputCurrency>0) {
    var result2 = (inputCurrency / rate).toFixed(2);
    document.getElementById('result2').innerHTML = result2;
    }else{
        var message = "Please, insert a valid number"
        document.getElementById('result').innerHTML = message;
    }
}

//=== Start Weather Function ===//

var iconRef;
var temp;
var currentDate; 

function getWeather() {
    var http = new XMLHttpRequest();
    var api_key = '1a517cfd74c70692d518a6425bd0d041';
    var api = 'https://api.darksky.net/forecast/';
    var units = "si";   //I defined this units in orther to get the Temperature in Celsious

//declaration of variable url to get the data
var url = api
  +encodeURIComponent(api_key)
  + '/' +encodeURIComponent(latitude)
  + ',' +encodeURIComponent(longitude)
  + '?units=' +encodeURIComponent(units);

console.log(url);

http.open("GET", url);
    
    //function
    http.onreadystatechange = (e)=>{
        if (http.readyState === 4 && http.status === 200){
        var response = http.responseText;
        var responseJSON = JSON.parse(response);
    
        console.log(responseJSON);
    
        temp = responseJSON.currently.temperature;
        var currentTimeUNIX = responseJSON.currently.time;
        var weeklySummary = responseJSON.daily.summary;
        var summary = responseJSON.currently.summary;
        iconRef = responseJSON.currently.icon;
        var highTemp = responseJSON.daily.data[0].apparentTemperatureHigh;
        var lowTemp = responseJSON.daily.data[0].apparentTemperatureLow;
        var cloud = (responseJSON.currently.cloudCover*100).toFixed(2);
        //var alert = responseJSON.alerts[1].title;

        console.log(iconRef+" this is the icon code");
        console.log(summary);
        console.log(temp+"testing");
        
        document.getElementById("set-icon").id = iconRef;
        skycons();
        
        var weatherOutput = summary                             
                            +"<br>Temperature: " + temp + " °C" + "<br>"
                            + "Max: " + highTemp + " °C" + " / Min: " + lowTemp + " °C" + "<br>"
                            +"<br>Cloud : " + cloud +"% <br>"
                            +"<br>The weather for the next days:<br>"+ weeklySummary;
        
        
        document.getElementById('getWeather').innerHTML = weatherOutput;

        currentDate = timeConverter(currentTimeUNIX);
      
    
    }};
    http.send();
}

function skycons() {

            
        icons = new Skycons({
            "color" : "pink",
            "resizeClear": true // nasty android hack
        }),

        icons.set("clear-day", Skycons.CLEAR_DAY);
        icons.set("clear-night", Skycons.CLEAR_NIGHT);
        icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
        icons.set("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
        icons.set("cloudy", Skycons.CLOUDY);
        icons.set("rain", Skycons.RAIN);
        icons.set("sleet", Skycons.SLEET);
        icons.set("snow", Skycons.SNOW);
        icons.set("wind", Skycons.WIND);
        icons.set("fog", Skycons.FOG);
// animate the icons
icons.play();
};


//Convert the UNIX timestamp from API into Date, for save Data in file
function timeConverter(UNIX_timestamp){
    var date = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = date.getFullYear();
    var month = months[date.getMonth()];
    var day = date.getDate();
    var time = day + ' ' + month + ' ' + year ;
    return time;
  }

//=== end Weather ===//

//=== Start Map function ===//

//initMap function

function myMap() {
    var currentLocation = {lat:latitude,lng:longitude};

    var map = new google.maps.Map(document.getElementById("map"),  
    { zoom: 18,
      center: currentLocation
    });
    
    //I added the animation
    marker = new google.maps.Marker({
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: {lat:latitude , lng:longitude }
    });
    marker.addListener('click', toggleBounce);

  }

  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
//=== end Map function===//

//====Start Write/Read Function My Trips ====//

var mytrip;
var contentGlobal="";
var fileEntryGlobal;

function tryingFile() {

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);   //the trying system functiion call the request one, when taht is succesful, calls the file  system callback

}

function fileSystemCallback(fs) {

    // Name of the file I want to create
    var fileToCreate = "myTrips.txt";

    // Opening/creating the file
    fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);

}

var fileSystemOptionals = { create: true, exclusive: false };

function getFileCallback(fileEntry) {
   //fileEntry 
    fileEntryGlobal = fileEntry;
       
}

// Let's write some files
function writeFile(tripDetail) {
    readFile();
        
    contentGlobal = contentGlobal + " -- " + tripDetail;
    var dataObj = new Blob([contentGlobal], { type: 'text/plain' });

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntryGlobal.createWriter(function (fileWriter) {

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob([contentGlobal], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            var saveFile = "Successful Data Saved";
            document.getElementById("saved").innerHTML=saveFile;
            //readFile();
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
            document.getElementById('saved').innerHTML="Please, try again.";
        };    

    });
        
}

// Let's read some files
function readFile() {

    // Get the file from the file entry
    fileEntryGlobal.file(function (file) {

        // Create the reader
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = function () {

            console.log("Successful file read: " + this.result);
            console.log("file path: " + fileEntryGlobal.fullPath);
            contentGlobal = this.result;
        };

    }, onError);
}

function onError(msg) {
    console.log(msg);
}


//Create the string with the data I want to save
function showTripDetail(){
    mytrip = "The "+ currentDate +" I was in "+ city +" and the Temperature was "+ temp + " °C. ";
    document.getElementById("displayData").innerHTML= mytrip; 
    //map 
    myMap();
}

function deleteTrip() {

    // remove the file
    fileEntryGlobal.remove(successDelete, fail);
    document.getElementById('historyRemove').innerHTML="Your data has been deleted!!";
    tryingFile();
}

function successDelete(entry) {
    console.log("Removal succeeded.");
}

function fail(error) {
    console.log('Error removing file: ' + error.code);
}

function saveTrip() {
    
    writeFile(mytrip);

}







    
