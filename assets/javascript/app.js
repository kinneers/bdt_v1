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
        behavior = $('#goal').val().trim();

        //Takes a snapshot of the database to determine whether the student is already in it
        database.ref().once('value', function(quicksnapshot) {
            /*If the fields are not empty and studentName is not in database, it is created and
            the behavior is pushed under the studentName. A counter is also created to track the
            number of behaviors currently being tracked for that student.*/
            if ((studentName !== '') && (behavior !== '') && (!quicksnapshot.child(studentName).exists())) {
                database.ref(studentName).set({
                    behavior1: behavior,
                    numBehaviors: 1
                });
            }
            /*If studentName is already in database, the behavior is pushed as a new behavior for that student. */
            else if ((studentName !== '') && (behavior !== '') && (quicksnapshot.child(studentName).exists()) && (quicksnapshot.child(studentName).val().numBehaviors === 1)) {
                database.ref(studentName).update({
                    behavior2: behavior,
                    numBehaviors: 2
                });
            }
            /*If studentName is already in database, the behavior is pushed as a new behavior for that student. */
            else if ((studentName !== '') && (behavior !== '') && (quicksnapshot.child(studentName).exists()) && (quicksnapshot.child(studentName).val().numBehaviors === 2)) {
                database.ref(studentName).update({
                    behavior3: behavior,
                    numBehaviors: 3
                });
            }
//WE NEED TO MAKE THIS A MODAL AT SOME POINT
            /*If student already has 3 goals present message.*/
            else if ((studentName !== '') && (behavior !== '') && (quicksnapshot.child(studentName).exists()) && (quicksnapshot.child(studentName).val().numBehaviors === 3)) {
                console.log("Research shows that focusing intensively on a few behavioral goals is most effective.  Therefore, our system only allows support for 3 goals at any given time.");
            }
            else {
                //Future: create modal to prompt user to enter data
                console.log("Error");
            }
        });        
        //Clear form fields
        $('#studentName').val('');
        $('#goal').val('');
    })
    
    // Firebase watcher + initial loader for "Today's Progress"
    database.ref().on("child_added", function(snapshot) {
        //Appends current values to the page
        //Code to append data for just one behavior
        if (snapshot.val().numBehaviors === 1) {
            $('#well').append(
                `<tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior1}</td>
                    <td></td>
                <tr>`
            )
        }
        //Code to append data for two behaviors
        else if (snapshot.val().numBehaviors === 2) {
            $('#well').append(
                `<tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior1}</td>
                    <td></td>
                <tr>
                <tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior2}</td>
                    <td></td>
                <tr>`
            )
        }
        //Code to append data for three behaviors
        else if (snapshot.val().numBehaviors === 3) {
            $('#well').append(
                `<tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior1}</td>
                    <td></td>
                <tr>
                <tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior2}</td>
                    <td></td>
                <tr>
                <tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior3}</td>
                    <td></td>
                <tr>`
            )
        }
        else {
            console.log("Error");
        }
    // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);    
    });

    //API call to They Said So for inspirational quote of the day
    $.ajax({
        url: "http://quotes.rest/qod.json?category=inspire",
        method: "GET"
    }).then(function(response){
        $('#quote').text(response.contents.quotes[0].quote);
        $('#source').text(response.contents.quotes[0].author);
    })

    //API call for Joke of the Day
    function getJoke() {
        var queryURL = "https://api.jokes.one/jod";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            $("#joke").text(response.contents.jokes[0].joke.text);
        });
    };
    getJoke();

    //API call for Farm Sense- uses UNIX timestamp
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
    getMoon();
})