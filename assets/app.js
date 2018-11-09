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

database.ref().on("child_added", function(snapshot) {
    var shortcut = snapshot.val();

    var newRow = $("<tr>");

    var newTrain = $("<td>");
    newTrain.text(shortcut.name);

    var newDest = $("<td>");
    newDest.text(shortcut.desination);

    var newFreq = $("<td>");
    newFreq.text(shortcut.frequency)

    var nextArrival = $("<td>");
    nextArrival.text("????");

    var minutesAway = $("<td>");
    minutesAway.text("????");

    newRow.append(newTrain);
    newRow.append(newDest);
    newRow.append(newFreq);
    newRow.append(nextArrival);
    newRow.append(minutesAway);

    $("#trains-table").append(newRow);

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

$("#form-submit-btn").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainTime = $("#first-time-input").val().trim();
    var freq = $("#frequency-input").val().trim();

    database.ref().push({
        name: trainName,
        desination: destination,
        firstTime: trainTime,
        frequency: freq,
    });

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");
});