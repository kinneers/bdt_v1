$(document).ready(function() {
    //Global Variables
    var studentName = '';
    var behavior = '';
    var errMessage = "";
    var studentArray = [];
    var bxArrayLinkedtoStudent = [];
    var bxArray = [];
    var met;
    var tracked;
    var savedSnapshot;



    console.log(studentArray);
    console.log(bxArray);

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
                    numBehaviors: 1,
                    met: 0,
                    tracked: 0
                });
            }
            /*If studentName is already in database, the behavior is pushed as a new behavior for that student. */
            else if ((studentName !== '') && (behavior !== '') && (quicksnapshot.child(studentName).exists()) && (quicksnapshot.child(studentName).val().numBehaviors === 1)) {
                database.ref(studentName).update({
                    behavior2: behavior,
                    numBehaviors: 2,
                    met: 0,
                    tracked: 0

                });
            }
            /*If studentName is already in database, the behavior is pushed as a new behavior for that student. */
            else if ((studentName !== '') && (behavior !== '') && (quicksnapshot.child(studentName).exists()) && (quicksnapshot.child(studentName).val().numBehaviors === 2)) {
                database.ref(studentName).update({
                    behavior3: behavior,
                    numBehaviors: 3,
                    met: 0,
                    tracked: 0
                });
            }
            /*If student already has 3 goals present message.*/
            else if ((studentName !== '') && (behavior !== '') && (quicksnapshot.child(studentName).exists()) && (quicksnapshot.child(studentName).val().numBehaviors === 3)) {
                errMessage = "Research shows that focusing intensively on a few behavioral goals is most effective.  Therefore, our system only allows support for 3 goals at any given time.";
                console.log(errMessage);
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
        savedSnapshot = snapshot;
        
        //Creates an array of all students in the database
        studentArray.push(snapshot.key);
        //console.log(studentArray);

        //Create an array of all behaviors in the database
        var item = snapshot.key + snapshot.val().behavior1;
        bxArrayLinkedtoStudent.push(item);
        var item = snapshot.key + snapshot.val().behavior2;
        bxArrayLinkedtoStudent.push(item);
        var item = snapshot.key + snapshot.val().behavior3;
        bxArrayLinkedtoStudent.push(item);
        //console.log(bxArrayLinkedtoStudent);

        //Create an array of all behaviors in the database
        var item = snapshot.val().behavior1;
        bxArray.push(item);
        var item = snapshot.val().behavior2;
        bxArray.push(item);
        var item = snapshot.val().behavior3;
        bxArray.push(item);
        //console.log(bxArray);
        

        
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

            $('#bxRatings').append(
                `<div class="form-group">
                    <h4>Joyful Jodi</h4> 
                    <label for="JoyfulJodi">Wear crown all day</label>
                    <select class="form-control" id="JoyfulJodi">
                        <option class="form-control" type="text" disabled selected>Choose...</option>
                        <option value='1'>Met</option>
                        <option value='0'>Did Not Meet</option>
                        <option value='null'>N/A</option>
                    </select>
                </div>`
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


    database.ref().on("value", function(snapshot) {

        $('#bhvrSaveBtn').on('click tap', function() {
            console.log('Working');
            studentName = 'Joyful Jodi';

            var rating = parseInt($('#JoyfulJodi').val());

            console.log(parseInt(snapshot.val().met));
            console.log(parseInt(snapshot.child(studentName).val().tracked));
            
            console.log(snapshot.val().met);
            console.log(tracked);
            console.log($('#JoyfulJodi').val());

            if (rating === 1) {
                met++;
                tracked++;
                database.ref('Joyful Jodi').update({
                    met: met,
                    tracked: tracked
                })
                console.log("Met... met++ tracked++");
            }
            else if (rating === 0) {
                tracked++;
                database.ref('Joyful Jodi').update({
                    tracked: tracked
                })
                console.log("Not met... tracked++");
            }
            else {
                console.log("The student was not available to be rated.");
            }
    });
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
            var joke = response.contents.jokes[0].joke.text;
            $("#joke").text(joke);
        });
    };
    getJoke();

    //API call for Farm Sense- uses UNIX timestamp
    function getMoon() {
        //FarmSense API - uses UNIX timestamp
        var unixTime = moment().unix();
        var queryURL = "http://api.farmsense.net/v1/moonphases/?d=" + unixTime;
        //console.log("queryURL: " + queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            //console.log("getMoon response: " + response);
            var moonArray = JSON.parse(response);
            //console.log(moonArray[0].Phase);
        });
    };
    getMoon();


    
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
            var bxDescription = snapshot.val().behavior1
        }
        else if (bxNum === 2) {
            var bxObject = snapshot.val().b2data;
            var bxDescription = snapshot.val().behavior2
        }
        else {
            var bxObject = snapshot.val().b3data;
            var bxDescription = snapshot.val().behavior3
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

})