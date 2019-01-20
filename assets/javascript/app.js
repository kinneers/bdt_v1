$(document).ready(function() {
    //Global Variables
    var studentName = '';
    var behavior = '';
    var errMessage = "";
    var met;
    var tracked;
    var studentList = [];
    var eachKey = [];
    var currentMet;
    var currentTracked;
    var currentKey;
    var currentProgress;

    //API CALLS

    //API call to They Said So for inspirational quote of the day
    function getQuote() {
        $.ajax({
            url: "https://quotes.rest/qod.json?category=inspire",
            method: "GET"
        }).then(function(response){
            $('#quote').text(response.contents.quotes[0].quote);
            $('#source').text(response.contents.quotes[0].author);
        })
    }
    getQuote();

    //API call for Joke of the Day
    function getJoke() {
        var queryURL = "https://api.jokes.one/jod";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            var joke = response.contents.jokes[0].joke.text;
            $("#joke").text(joke);
        });
    };
    getJoke();

    //API call for Farm Sense- uses UNIX timestamp
    function getMoon() {
        //FarmSense API - uses UNIX timestamp
        var unixTime = moment().unix();
        //The code below uses a proxy because github requires https and this api was not availible in https
        var queryURL = "https://cors-anywhere.herokuapp.com/http://api.farmsense.net/v1/moonphases/?d=" + unixTime;
        //console.log("queryURL: " + queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            //console.log("getMoon response: " + response);
            var moonArray = JSON.parse(response);
            //console.log(moonArray[0].Phase);
            phase = moonArray[0].Phase;
            //console.log("phase variable is: " + phase);
            var moonClip = 0;  
            var phases = ["New Moon","Waxing Crescent","1st Quarter","Waxing Gibbous","Full Moon","Waning Gibbous","3rd Quarter","Waning Crescent","Dark Moon"];
            for (var i = 0; i < phases.length; i++) {
                if (phases[i] === phase) {
                    moonClip = i
                }
            }
            //Treating "Dark Moon" phase as "New Moon" for practical purposes
            if (moonClip === 8) {
                phase = "New Moon";
                moonClip = 0;
            }
            $("#moon-phase").text(phase);
            var dispMoon = "<img src='assets/images/moon" + moonClip + ".jpg' class='rounded mx-auto d-block moonPhoto'>";
            $("#phases-appear-here").html(dispMoon);
        });
    };    
    getMoon();

    function getWeather(zip) {
        //var apiKey = "9098488de48b8a1057b705dbcc308613";
        var apiKey = "e3e3ed7a89cf8bdd79c4a895a82cb180";  //default key
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&appid=" + apiKey;
        //console.log("queryURL: " + queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            var currCond = "Current Conditions: " + response.weather[0].description;
            $("#conditions").text(currCond);
            var tempK = response.main.temp;
            // returned temperature is in Kelvin, convert to Fahrenheit
            var tempF = ((tempK - 273.15) * (9/5) + 32);
            tempF = Math.round(tempF);
            // use degree symbol
            tempF = "Temperature: " + tempF + "&#8457";
            $("#temperature").html(tempF);
            var humdt = "Humidity: " + response.main.humidity + "%";
            $("#humidity").text(humdt);
            var wind = "Wind Speed: " + response.wind.speed + " MPH";
            $("#winds").text(wind);
            var pres = "Pressure: " + response.main.pressure + " millibars";
            $("#pressure").text(pres);
        });
    };
    getWeather(30506);

    // Initialize Firebase
    /*THIS IS THE TESTER VERSION- MUST BE CHANGED BACK BEFORE ANY PULL REQUESTS!!!
    var config = {
        apiKey: "AIzaSyDPE-hUwr7OkDNKYPVZxJkvNdRoJXza8oQ",
        authDomain: "tester-for-bx-tracking.firebaseapp.com",
        databaseURL: "https://tester-for-bx-tracking.firebaseio.com",
        projectId: "tester-for-bx-tracking",
        storageBucket: "tester-for-bx-tracking.appspot.com",
        messagingSenderId: "197911738618"
    };
    firebase.initializeApp(config);
    */

    // Initialize Firebase
    //This is the actual database ref!!!
    var config = {
        apiKey: "AIzaSyBI7PADfav8k7OjpKxN2Otow5smDRuyMNI",
        authDomain: "behavioral-tracking.firebaseapp.com",
        databaseURL: "https://behavioral-tracking.firebaseio.com",
        projectId: "behavioral-tracking",
        storageBucket: "behavioral-tracking.appspot.com",
        messagingSenderId: "758368700182"
    };
    firebase.initializeApp(config);
    

    //Set database reference
    var database = firebase.database();

    //Add student and behavior to Firebase DB
    $('#addStudent').on('click tap', function(event) {
        event.preventDefault();
        //Capture values for student name and behavior
        studentName = $('#studentName').val().trim();
        behavior = $('#goal').val().trim();

        //Takes a snapshot of the database to determine whether the student is already in it
        database.ref().once('value', function(quicksnapshot) {
            if ((studentName !== '') && (behavior !== '')) {
                database.ref().push({
                    behavior: {name: studentName,
                                behavior,
                                met: 0,
                                tracked: 0,
                                dayProgress: 0},
                });
            }
            else {
                //Future: create modal to prompt user to enter data
                errMessage = "No Student Data Entered";
                console.log(errMessage);
            }
        }); 
        // error checking
        if (errMessage !== "") {
            $('#warnModalText').text(errMessage);
            $('#errModal').modal();
            errMessage = "";
        };
        //Clear form fields
        $('#studentName').val('');
        $('#goal').val('');
    }) 
    
    // Firebase watcher + initial loader for "Today's Progress"
    database.ref().on("child_added", function(snapshot) {
        studentName = snapshot.val().behavior.name;
        //console.log(studentName);
        behavior = snapshot.val().behavior.behavior;
        //console.log(behavior);
        currentProgress = snapshot.val().behavior.dayProgress;

        $('#well').append(
            `<tr id="${snapshot.key}">
                <td>${studentName}</td>
                <td>${behavior}</td>
                <td>${currentProgress}</td>
            <tr>`
        )

        $('#bxRatings').append(
            `<div class="form-group">
                <h4>${studentName}</h4> 
                <label for="${snapshot.key}">${behavior}</label>
                <select class="form-control" id="${snapshot.key}">
                    <option class="form-control" type="text" disabled selected>Choose...</option>
                    <option value='1'>Met</option>
                    <option value='0'>Did Not Meet</option>
                    <option value='null'>N/A</option>
                </select>
            </div>`
        )

        $('#bxSaveButton').on('click tap', function() {
            rating = $('#bxRatings #' + snapshot.key).val();
            //console.log("The rating selected is: " + rating);
            met = snapshot.val().behavior.met;
            //console.log("The database currently states this goal has been met " + met + " times");
            tracked = snapshot.val().behavior.tracked;
            //console.log("The database currently states this goal has been tracked " + tracked + " times");
            currentKey = snapshot.key;
            //console.log("The database key for the above data is: " + currentKey);
            behavior = snapshot.val().behavior.behavior;
            //console.log("The behavior being tracked is: " + behavior);
            name = snapshot.val().behavior.name;
            //console.log("The student this behavior refers to is: " + name);

            //Increments met and tracked appropriately according to rating
            if (rating === "1") {
                met++;
                console.log(met);
                tracked++;
                console.log(tracked);
                database.ref(currentKey).update({
                    behavior: { behavior,
                                met,
                                tracked,
                                name,
                                dayProgress: (Math.floor((met/tracked)*100))
                            }
                })
            }
            else if (rating === "0") {
                met;
                console.log(met);
                tracked++;
                console.log(tracked);
                database.ref(currentKey).update({
                    behavior: { behavior,
                                met,
                                tracked,
                                name,
                                dayProgress: (Math.floor((met/tracked)*100))
                            }
                })
            }
            else if (rating === 'null') {
                console.log("The student was not available to be rated.");
            }
            else {
                console.log("Error");
            }
            location.reload();
        })
    });

/*  
We hardcoded the data from the data capture as we have not quite worked it out due to the complexity of the data.
We will be using a more robust database in future phases, so this was not of great concern at this time.
    AT THE END OF THE DAY:
    -Either event from moment OR button click to wrap up the day
    -Capture day and percentage and save in chart.js form (like Silly Sarah is now)
*/
    //CHART.JS

    //Database listener for the charts for a particular student
    database.ref('Silly Sarah').on('value', function(snapshot) {
        //Creates chart for each behavior for this student
        createChart(snapshot, 1, 'myChart1');
        createChart(snapshot, 2, 'myChart2');
        createChart(snapshot, 3, 'myChart3');

    })
    //Function to create a chart
    function createChart(snapshot, bxNum, placementOnPage) {
        //Determines which behavior is being graphed and assigns the requested object to a variable for easier manipulation
        if (bxNum === 1) {
            var bxObject = snapshot.val().b1data;
            var bxDescription = snapshot.val().behavior1.behavior;
        }
        else if (bxNum === 2) {
            var bxObject = snapshot.val().b2data;
            var bxDescription = snapshot.val().behavior2.behavior;
        }
        else {
            var bxObject = snapshot.val().b3data;
            var bxDescription = snapshot.val().behavior3.behavior;
        }
    //Get the keys of the object and store them in an array
    var keys = [];
    for(var key in bxObject) {
        if(bxObject.hasOwnProperty(key)) { //to be safe
            keys.push(key);
        }
    }
    //Get the values of the object and store them in an array
    var values = [];
    values = Object.values(bxObject);
    //Create chart for behavior 1
    var ctx = document.getElementById(placementOnPage);
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: keys,
            datasets: [{
                label: snapshot.key + ': % of day for: ' + bxDescription,
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                        max: 100
                    }
                }]
            }
        }
        });
    }

    //AJAX Error Warning
    $(document).ajaxError(function(event, jqxhr, settings, thrownError){
        $("#warnModalText").html("An error has occured - some information may not be displayed.</br>Error: " + thrownError + "</br>Status: " + jqxhr.status + "</br>" + settings.url);
         $('#errModal').modal();
     });
});