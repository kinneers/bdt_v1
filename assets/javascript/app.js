$(document).ready(function() {
    //Global Variables
    var studentName = '';
    var behavior = '';
    var errMessage = "";
    var met;
    var tracked;
    var currentKey;
    var currentProgress;
    var currDates = [];
    var currData = [];
    var allKeys = [];

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

    // OpenWeatherMap API - using HTML5 GeoLocation feature
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        } else { 
            errMessage = "Geolocation is not supported by this browser.";   
            console.log(errMessage);
            $('#warnModalText').text(errMessage);
            $('#errModal').modal();
            errMessage = "";
            };

    function showPosition(position) {
        var lat = roundTo((position.coords.latitude),2);
        var lon = roundTo((position.coords.longitude),2); 
        // OpenWeatherMap API call
        var apiKey = "9098488de48b8a1057b705dbcc308613";  //proect-one key
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey; 

        $.ajax({
            url: queryURL,
            method: "GET"   
        })
        .then(function(response) {
            var currCond = "Current Conditions: " + response.weather[0].description;
            $("#conditions").text(currCond);
            var tempK = response.main.temp;
            var tempF = ((tempK - 273.15) * (9/5) + 32);
            tempF = Math.round(tempF);
            tempF = "Temperature: " + tempF + "&#8457";
            $("#temperature").html(tempF);
            var humdt = "Humidity: " + response.main.humidity + "%";
            $("#humidity").text(humdt);
            var wind = "Wind Speed: " + response.wind.speed + " MPH";
            $("#winds").text(wind);
            var pres = roundTo(( response.main.pressure * 0.0295301 ),2);
            $("#pressure").text("Pressure: " + pres + " inHg");
        });
    }; 

    function roundTo(n, digits) {
        var negative = false;
        if (digits === undefined) {
            digits = 0;
        }
            if( n < 0) {
            negative = true;
        n = n * -1;
        }
        var multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        n = (Math.round(n) / multiplicator).toFixed(2);
        if( negative ) {    
            n = (n * -1).toFixed(2);
        }
        return n;
    }

    // Initialize Firebase
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

        //Adds student to the database
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
        //Add a carousel item with the ID of the current key (needed to display chart)
        currentKey = snapshot.key;
        allKeys.push(currentKey);
        console.log(allKeys);
        if (allKeys.length === 1) {
        $('#addCarouselItem').append(
            `<div class="carousel-item active">
                <canvas id="${currentKey}" width="400" height="400"></canvas>
            </div>`
        );
        } else {
            $('#addCarouselItem').append(
                `<div class="carousel-item">
                    <canvas id="${currentKey}" width="400" height="400"></canvas>
                </div>`
            )
        }

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
            chartData = snapshot.val().chartData;

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
                            },
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
                            },
                })
            }
            else if (rating === 'null') {
                console.log("The student was not available to be rated.");
            }
            else {
                console.log("Error");
            }
            //Necessary in order to update the new values to the page
            location.reload();
        })

        $('#bxRateDay').on('click tap', function() {
            //Retrieve the current values from each database entry
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
            dayProgress = snapshot.val().behavior.dayProgress;
            console.log(dayProgress);
            
            var today = moment().format('MM/DD/YYYY HH:mm');

            if (!snapshot.val().chartData) {
                database.ref(currentKey).set({
                            chartData: {
                                        date: [today],
                                        data: [dayProgress]
                                        }
                })
                database.ref(currentKey).update({
                    behavior: { behavior,
                                met: 0,
                                tracked: 0,
                                name,
                                dayProgress: 0
                            }
                })
            }
            else if (snapshot.val().chartData) {
                //get current date and data arrays and push new values, then set new values
                currDates = snapshot.val().chartData.date;
                console.log(currDates);
                currDates.push(today);
                console.log(currDates);
                currData = snapshot.val().chartData.data;
                currData.push(dayProgress);
                console.log(currData);
                database.ref(currentKey).update({
                    chartData: {
                                date: currDates,
                                data: currData
                                }
                })
                database.ref(currentKey).update({
                    behavior: { behavior,
                                met: 0,
                                tracked: 0,
                                name,
                                dayProgress: 0
                            }
                })
            }
            //Required to display updated charts
            location.reload();
        })

        //CHART.JS
       
        currData = snapshot.val().chartData.data;
        console.log(currData);
        currDates = snapshot.val().chartData.date;
        console.log(currDates);
        currKey = snapshot.key;
        console.log(typeof(currKey));
        //Create chart for behavior
        //Note that the value for getElementById must come from the dynamically added HTML 
        var ctx = document.getElementById(currKey).getContext('2d');        
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: currDates,
                datasets: [{
                    label: snapshot.val().behavior.name + ': % of day for: ' + snapshot.val().behavior.behavior,
                    data: currData,
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
    });

    //AJAX Error Warning
    $(document).ajaxError(function(event, jqxhr, settings, thrownError){
        $("#warnModalText").html("An error has occured - some information may not be displayed.</br>Error: " + thrownError + "</br>Status: " + jqxhr.status + "</br>" + settings.url);
         $('#errModal').modal();
     });
});