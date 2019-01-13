$(document).ready(function() {
    //Global Variables
    var studentName = '';
    var behavior = '';

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
        behavior = $('#goal1').val().trim();

        //Validate Inputs
        
        //Check that student name is not already in database
        //if not in database, initialize student and goal 1
        //if so, ask if the user wants to create an additional goal

        console.log(studentName, behavior);

        //Add new student to database
        database.ref(studentName).push({
            behavior
        });
    })

    //API call to They Said So for inspirational quote of the day
    $.ajax({
        url: "http://quotes.rest/qod.json?category=inspire",
        method: "GET"
    }).then(function(response){
        $('#quote').text(response.contents.quotes[0].quote);
        $('#source').text(response.contents.quotes[0].author);
    })

    //API call for Joke of the Day
    getJoke();

        function getJoke() {
            var queryURL = "https://api.jokes.one/jod";
            $.ajax({
            //$.getJSON({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {
                console.log(response.contents.jokes[0].joke.text);
                $("#joke").text(response.contents.jokes[0].joke.text);
            });
        };
})

    function getMoon() {
        //FarmSense API - uses UNIX timestamp
        var unixTime = moment().unix();
        var queryURL = "http://api.farmsense.net/v1/moonphases/?d=" + unixTime;
        console.log("queryURL: " + queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            console.log("getMoon response: " + response);
            var moonArray = JSON.parse(response);
            console.log(moonArray[0].Phase);
        });
    };
