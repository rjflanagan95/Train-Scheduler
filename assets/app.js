// Initialize Firebase
var config = {
    apiKey: "AIzaSyCk4kaA389km_TJskRQf_yE33pSVKIPhtg",
    authDomain: "train-scheduler-3f8bc.firebaseapp.com",
    databaseURL: "https://train-scheduler-3f8bc.firebaseio.com",
    projectId: "train-scheduler-3f8bc",
    storageBucket: "train-scheduler-3f8bc.appspot.com",
    messagingSenderId: "1059866805514"
};

firebase.initializeApp(config);
var database = firebase.database();

// submit the form when the `submit` button is clicked
$("#form-submit-btn").on("click", function(event) {
    event.preventDefault();

    // grab the input from the form
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainTime = $("#first-time-input").val().trim();
    var freq = $("#frequency-input").val().trim();

    // if any part of the train information is missing, don't add it to the database
    if (trainName === "" || destination === "" || trainTime === "" || freq === "") {
        alert("Please include all train information before submitting!")
    // else add it to the database
    } else {
        database.ref().push({
            name: trainName,
            desination: destination,
            firstTime: trainTime,
            frequency: freq,
        });
        // clear the input form
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-time-input").val("");
        $("#frequency-input").val("");
    }
});

database.ref().on("value", function(snapshot) {
    refreshTrains(snapshot);
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

function refreshTrains(snap) {
    // when a new train is added, loop through the object and reprint the trains on the table
    // mostly did it this way so I could potentially introduce a way to sort the table so that the trains arriving soonest appear at the top of the table, but I wasn't able to figure that out
    $("#trains-table").empty();

    for (var i in snap.val()) {
        var shortcut = (snap.val())[i];

        // create a new row
        var newRow = $("<tr>");
    
        // create data for the row
        var newTrain = $("<td>");
        newTrain.text(shortcut.name);
        var newDest = $("<td>");
        newDest.text(shortcut.desination);
        var newFreq = $("<td>");
        newFreq.text(shortcut.frequency)
    
        var firstTime = shortcut.firstTime;
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        var currentTime = moment(currentTime).format("HH:mm");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var timeRemaining = (diffTime % shortcut.frequency);
        var minutesTilArrival = shortcut.frequency - timeRemaining;
        var nextTrain = moment().add(minutesTilArrival, "minutes");
    
        var nextArrival = $("<td>");
        nextArrival.text(moment(nextTrain).format("HH:mm"));
        var minutesAway = $("<td>");
        minutesAway.text(minutesTilArrival);

        var removeBtn = $("<button>");
        removeBtn.text("Remove Train");
        removeBtn.attr("class", "btn btn-dark btn-sm remove-button");
        // storing the Firebase id as the id of the remove button for easy access later
        removeBtn.attr("id", i);
        var btnCell = $("<td>");
        btnCell.append(removeBtn);
    
        // append all the new data to the row
        newRow.append(newTrain);
        newRow.append(newDest);
        newRow.append(newFreq);
        newRow.append(nextArrival);
        newRow.append(minutesAway);
        newRow.append(btnCell);

        // even the small button is too big to align properly with the text so it was necessary to include margins
        newRow.attr("style", "margin: 5px 0px 5px 0px");
    
        // append the row to the timetable
        $("#trains-table").append(newRow);
    }
}


$(document).on("click", ".remove-button",  function() {
    // the id of the remove button is the same as the id of the train in the database
    database.ref().child($(this).attr("id")).remove();
});