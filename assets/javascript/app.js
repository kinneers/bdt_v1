$(document).ready(function() {
    //Global Variables
    var studentName = '';
    var behavior = '';
    var errMessage = "";
    var studentArray = [];
    var studentArrayCompressed = [];
    var bxArray = [];
    var bxArrayLinkedtoStudent = [];
    var bxArrayLinkedtoStudentCompressed = [];
    var met;
    var tracked;

    console.log(studentArray);
    console.log(studentArrayCompressed);
    console.log(bxArray);
    console.log(bxArrayLinkedtoStudent);
    console.log(bxArrayLinkedtoStudentCompressed);

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
                    behavior1: {behavior,
                                met: 0,
                                tracked: 0},
                    numBehaviors: 1,  
                });
            }
            /*If studentName is already in database, the behavior is pushed as a new behavior for that student. */
            else if ((studentName !== '') && (behavior !== '') && (quicksnapshot.child(studentName).exists()) && (quicksnapshot.child(studentName).val().numBehaviors === 1)) {
                database.ref(studentName).update({
                    behavior2: {behavior,
                                met: 0,
                                tracked: 0},
                    numBehaviors: 2,
                });
            }
            /*If studentName is already in database, the behavior is pushed as a new behavior for that student. */
            else if ((studentName !== '') && (behavior !== '') && (quicksnapshot.child(studentName).exists()) && (quicksnapshot.child(studentName).val().numBehaviors === 2)) {
                database.ref(studentName).update({
                    behavior3: {behavior,
                                met: 0,
                                tracked: 0},
                    numBehaviors: 3,
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
            //Reloads the page when a student/behavior is created in order for the on value function to recognize the new data
            location.reload();
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
        
        //Creates an array of all students in the database in both compressed and uncompressed versions
        studentArray.push(snapshot.key);
        studentArrayCompressed.push(snapshot.key.replace(/\s+/g, ''));

        /*
        //Create an array of all behaviors in the database
        var item = snapshot.val().behavior1.behavior;
        bxArray.push(item);
        var item = snapshot.val().behavior2.behavior;
        bxArray.push(item);
        var item = snapshot.val().behavior3.behavior;
        bxArray.push(item);
        console.log("bxArray: " + bxArray);
        */
        
        //Create an array of all behaviors in the database linked to student
        //One behavior exists
        var item = snapshot.key + snapshot.val().behavior1.behavior;
        bxArrayLinkedtoStudent.push(item);
        //Two behaviors exist
        if (snapshot.numBehaviors === 2){
            var item = snapshot.key + snapshot.val().behavior2.behavior;
            bxArrayLinkedtoStudent.push(item);
        }
        //Three behaviors exist
        if (snapshot.numBehaviors === 3){
            var item = snapshot.key + snapshot.val().behavior2.behavior;
            bxArrayLinkedtoStudent.push(item);
            var item = snapshot.key + snapshot.val().behavior3.behavior;
            bxArrayLinkedtoStudent.push(item);
        }

        //Create an array of all behaviors in the database linked to student with no spaces
        bxArrayLinkedtoStudentCompressed.push(snapshot.key.replace(/\s+/g, '') + snapshot.val().behavior1.behavior.replace(/\s+/g, ''));

        if (snapshot.numBehaviors === 2){
            bxArrayLinkedtoStudentCompressed.push(snapshot.key.replace(/\s+/g, '') + snapshot.val().behavior2.behavior.replace(/\s+/g, ''));
        }
        if (snapshot.numBehaviors === 3){
            bxArrayLinkedtoStudentCompressed.push(snapshot.key.replace(/\s+/g, '') + snapshot.val().behavior2.behavior.replace(/\s+/g, ''));
            bxArrayLinkedtoStudentCompressed.push(snapshot.key.replace(/\s+/g, '') + snapshot.val().behavior3.behavior.replace(/\s+/g, ''));        
        }

        //Appends current values to the page
        //Code to append data for just one behavior
        if (snapshot.val().numBehaviors === 1) {
            //create keys from student data, remove all spaces
            var stKey = snapshot.key;
            stKey = stKey.replace(/\s+/g, '');
            var bx1Key = snapshot.val().behavior1.behavior;
            bx1Key = bx1Key.replace(/\s+/g, '');

            $('#well').append(
                `<tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior1.behavior}</td>
                    <td></td>
                <tr>`
            )

            $('#bxRatings').append(
                `<div class="form-group">
                    <h4>${snapshot.key}</h4> 
                    <label for="${stKey}">${snapshot.val().behavior1.behavior}</label>
                    <select class="form-control" id="${stKey}">
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
            //create keys from student data, remove all spaces
            var stKey = snapshot.key;
            stKey = stKey.replace(/\s+/g, '');
            var bx1Key = snapshot.val().behavior1.behavior;
            bx1Key = bx1Key.replace(/\s+/g, '');
            var bx2Key = snapshot.val().behavior2.behavior;
            bx2Key = bx2Key.replace(/\s+/g, '');

            $('#well').append(
                `<tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior1.behavior}</td>
                    <td></td>
                <tr>
                <tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior2.behavior}</td>
                    <td></td>
                <tr>`
            )

            $('#bxRatings').append(
                `<div class="form-group">
                    <h4>${snapshot.key}</h4> 
                    <label for="${stKey}">${snapshot.val().behavior1.behavior}</label>
                    <select class="form-control" id="${stKey}">
                        <option class="form-control" type="text" disabled selected>Choose...</option>
                        <option value='1'>Met</option>
                        <option value='0'>Did Not Meet</option>
                        <option value='null'>N/A</option>
                    </select>
                    <label for="${stKey}">${snapshot.val().behavior2.behavior}</label>
                    <select class="form-control" id="${stKey}">
                        <option class="form-control" type="text" disabled selected>Choose...</option>
                        <option value='1'>Met</option>
                        <option value='0'>Did Not Meet</option>
                        <option value='null'>N/A</option>
                    </select>
                </div>`
            )            
        }
        //Code to append data for three behaviors
        else if (snapshot.val().numBehaviors === 3) {
            //create keys from student data, remove all spaces
            
            /*var stKey = snapshot.key;
            stKey = stKey.replace(/\s+/g, '');
            var bx1Key = snapshot.val().behavior1.behavior;
            bx1Key = bx1Key.replace(/\s+/g, '');
            var bx2Key = snapshot.val().behavior2.behavior;
            bx2Key = bx2Key.replace(/\s+/g, '');
            var bx3Key = snapshot.val().behavior3.behavior;
            bx3Key = bx3Key.replace(/\s+/g, '');*/

            $('#well').append(
                `<tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior1.behavior}</td>
                    <td></td>
                <tr>
                <tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior2.behavior}</td>
                    <td></td>
                <tr>
                <tr id="${snapshot.key}">
                    <td>${snapshot.key}</td>
                    <td>${snapshot.val().behavior3.behavior}</td>
                    <td></td>
                <tr>`
            )
            $('#bxRatings').append(
                `<div class="form-group">
                    <h4>${snapshot.key}</h4> 
                    <label for="${stKey}">${snapshot.val().behavior1.behavior}</label>
                    <select class="form-control" id="${stKey}">
                        <option class="form-control" type="text" disabled selected>Choose...</option>
                        <option value='1'>Met</option>
                        <option value='0'>Did Not Meet</option>
                        <option value='null'>N/A</option>
                    </select>
                    <label for="${stKey}">${snapshot.val().behavior2.behavior}</label>
                    <select class="form-control" id="${stKey}">
                        <option class="form-control" type="text" disabled selected>Choose...</option>
                        <option value='1'>Met</option>
                        <option value='0'>Did Not Meet</option>
                        <option value='null'>N/A</option>
                    </select>
                    <label for="${stKey}">${snapshot.val().behavior3.behavior}</label>
                    <select class="form-control" id="${stKey}">
                        <option class="form-control" type="text" disabled selected>Choose...</option>
                        <option value='1'>Met</option>
                        <option value='0'>Did Not Meet</option>
                        <option value='null'>N/A</option>
                    </select>
                </div>`
            )            
 
            }
        else {
            console.log("Error");
        }
        // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);    
    });

    for (var i = 0; i < studentArray; i++) {
        var currentStudent = studentArray[i];
        database.ref(currentStudent).on("value", function(snapshot) {
        
            //Captures the value of the rating
            $('#bhvrSaveBtn').on('click tap', function() {
                //Saves the rating
                var rating = parseInt($('#stKey').val());
                //var rating = parseInt($('#JoyfulJodi').val());
                //Gets current met and tracked values from Firebase
                met = parseInt(snapshot.val().behavior1.met);
                tracked = parseInt(snapshot.val().behavior1.tracked);
                var bx = snapshot.val().behavior1.behavior;
                //Increments met and tracked appropriately according to rating
                if (rating === 1) {
                    met++;
                    tracked++;
                    database.ref('Joyful Jodi').update({
                        behavior1: {behavior: bx,
                                    met: met,
                                    tracked: tracked}
                    })
                }
                else if (rating === 0) {
                    tracked++;
                    database.ref('Joyful Jodi').update({
                        behavior1: {behavior: bx,
                                    met: met,
                                    tracked: tracked}
                    })
                }
                else {
                    console.log("The student was not available to be rated.");
                }
            });
        // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);    
        });    
    }


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

    //API CALLS

    //API call to They Said So for inspirational quote of the day
    $.ajax({
        url: "https://quotes.rest/qod.json?category=inspire",
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
});