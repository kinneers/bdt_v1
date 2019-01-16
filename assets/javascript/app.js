$(document).ready(function() {
    //Global Variables
    var studentName = '';
    var behavior = '';
    var errMessage = "";

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
            $('#behavModalBody').append(
                `<label id="bhvrStudentName">${snapshot.key}</label>
                <div class="input-group mb-3">
                <div class="input-group-prepend">
                <label class="input-group-text" for="bhvrSelect"
                id="${snapshot.val().behavior1}">${snapshot.val().behavior1}</label></div>
                <select class="custom-select" id="bhvrSelect">
                <option selected>Choose...</option>
                <option value="1">Met</option>
                <option value="0">Did Not Meet</option>
                <option value="null">N/A</option></select></div>`                             
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
            $('#behavModalBody').append(
                `<label id="bhvrStudentName">${snapshot.key}</label>
                <div class="input-group mb-3">
                <div class="input-group-prepend">
                <label class="input-group-text" for="bhvrSelect"
                id="${snapshot.val().behavior1}">${snapshot.val().behavior1}</label></div>
                <select class="custom-select" id="bhvrSelect">
                <option selected>Choose...</option>
                <option value="1">Met</option>
                <option value="0">Did Not Meet</option>
                <option value="null">N/A</option></select></div>
                <div class="input-group mb-3">
                <div class="input-group-prepend">
                <label class="input-group-text" for="bhvrSelect"
                id="${snapshot.val().behavior2}">${snapshot.val().behavior2}</label></div>
                <select class="custom-select" id="bhvrSelect">
                <option selected>Choose...</option>
                <option value="1">Met</option>
                <option value="0">Did Not Meet</option>
                <option value="null">N/A</option></select></div>`                                                         
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
            $('#behavModalBody').append(
                `<label id="bhvrStudentName">${snapshot.key}</label>
                <div class="input-group mb-3">
                <div class="input-group-prepend">
                <label class="input-group-text" for="bhvrSelect"
                id="${snapshot.val().behavior1}">${snapshot.val().behavior1}</label></div>
                <select class="custom-select" id="bhvrSelect">
                <option selected>Choose...</option>
                <option value="1">Met</option>
                <option value="0">Did Not Meet</option>
                <option value="null">N/A</option></select></div>
                <div class="input-group mb-3">
                <div class="input-group-prepend">
                <label class="input-group-text" for="bhvrSelect"
                id="${snapshot.val().behavior2}">${snapshot.val().behavior2}</label></div>
                <select class="custom-select" id="bhvrSelect">
                <option selected>Choose...</option>
                <option value="1">Met</option>
                <option value="0">Did Not Meet</option>
                <option value="null">N/A</option></select></div>
                <div class="input-group mb-3">
                <div class="input-group-prepend">
                <label class="input-group-text" for="bhvrSelect"
                id="${snapshot.val().behavior3}">${snapshot.val().behavior3}</label></div>
                <select class="custom-select" id="bhvrSelect">
                <option selected>Choose...</option>
                <option value="1">Met</option>
                <option value="0">Did Not Meet</option>
                <option value="null">N/A</option></select></div>`                    
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
            //console.log("getMoon response: " + response);
            var moonArray = JSON.parse(response);
            //console.log(moonArray[0].Phase);
            phase = moonArray[0].Phase;
            console.log("phase variable is: " + phase);
            var moonClip = 0;  
            var phases = ["New Moon","Waxing Crescent","1st Quarter","Waxing Gibbous","Full Moon","Waning Gibbous","3rd Quarter","Waning Crescent","Dark Moon"];
            for (var i = 0; i < phases.length; i++) {
                if (phases[i] === phase) {
                    moonClip = i
                }
            }
            if (moonClip === 8) {
                phase = "New Moon";
                moonClip = 0;
            }
            $("#moon-phase").text(phase);
            var dispMoon = "<img src='assets/images/moon" + moonClip + ".jpg' class='rounded mx-auto d-block float-left moonPhoto'>";
            $("#phases-appear-here").html(dispMoon);
        });
    };    getMoon();

    //Database listener for the charts for a particular student
    database.ref("Silly Sarah").on('value', function(snapshot) {
         createChart(snapshot, 1);
    })

    function createChart(snapshot, bxNum) {
        //Determines which behavior is being graphed and assigns the requested object to a variable for easier manipulation
        if (bxNum === 1) {
            var b1Object = snapshot.val().b1data;
        }
        else if (bxNum === 2) {
            var b1Object = snapshot.val().b2data;
        }
        else {
            var b1Object = snapshot.val().b2data; 
        }

    //Get the keys of the object and store them in an array
    var keysb1 = [];
    for(var key in b1Object) {
        if(b1Object.hasOwnProperty(key)) { //to be safe
            keysb1.push(key);
        }
    }

    //Get the values of the object and store them in an array
    var valuesb1 = [];
    valuesb1 = Object.values(b1Object);
    
    //Create chart for behavior 1
    var ctx = document.getElementById("myChart1");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: keysb1,
            datasets: [{
                label: snapshot.key + ': % of day for: ' + snapshot.val().behavior1,
                data: valuesb1,
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