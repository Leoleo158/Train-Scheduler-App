$(document).ready(function() {

//firebase link

var firebaseConfig = {
    apiKey: "AIzaSyBmm8rkX10XUZPJMwLU62BcKZpxxZCeAZU",
    authDomain: "train-scheduler-32c9d.firebaseapp.com",
    databaseURL: "https://train-scheduler-32c9d.firebaseio.com",
    projectId: "train-scheduler-32c9d",
    storageBucket: "train-scheduler-32c9d.appspot.com",
    messagingSenderId: "1082824460664",
    appId: "1:1082824460664:web:e329e18c320d87dddba08d",
    measurementId: "G-CZHSZ8TB70"
};

 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);

 //link up firebase with js

 var database = firebase.database();

 //store data off on click of the submit button

 $('submitInput').on('click', function(event) {
    var trainName = $('#nameInput').val().trim();
    var destinationInput = $('#destInput').val().trim();
    var numberInput = $('#numberInput').val().trim();
    var timeInput = $('#timeInput').val().trim();
    var frequencyInput = $('#freqInput').val().trim();
});

//validation of input

    if (trainName != "" &&
    numberInput != "" &&
    destinationInput != "" &&
    timeInput.length === 4 &&
    frequencyInput != "") {
            
        //use the collected input (above) and port it to firebase db

        database.ref().push({
            name: trainName,
            number: numberInput,
            destination: destinationInput,
            time: timeInput,
            frequency: frequencyInput
        });
    } else {
        alert("Value does not exist, please enter in valid train data");
        $('input').val("");
        return false;
    }

    $('input').val("");
});

//grab child snapshot of data in FB

database.ref().on("child_added", function (childSnapshot) {
    var name = childSnapshot.val().name;
    var number = childSnapshot.val().number;
    var destination = childSnapshot.val().destination;
    var time = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;


    //time format

    var frequency = parseInt(frequency);
    var currentTime = moment();
    var dateConvert = moment(childSnapshot.val().time, "HHmm").subtract(1, "years");
    var trainTime = moment(dateConvert).format("HHmm");
    
    //time difference between times

    //difference bw the times
	var timeConvert = moment(trainTime, "HHmm").subtract(1, "years");
    var timeDifference = moment().diff(moment(timeConvert), "minutes");
    
    //remainder
    var timeRemaining = timeDifference % frequency;
    
    //time until next train
    var timeAway = frequency - timeRemaining;
    
    //next train arrival
    var nextArrival = moment().add(timeAway, "minutes");
    
    var arrivalDisplay = moment(nextArrival).format("HHmm");

//append data to table

$('#boardText').append(
    "<tr><td id='nameDisplay'>" + childSnapshot.val().name + 
		"<td id='numberDisplay'>" + childSnapshot.val().number + 
		"<td id='destinationDisplay'>" + childSnapshot.val().destination + 
		"<td id='frequencyDisplay'>" + childSnapshot.val().frequency +
		"<td id='arrivalDisplay'>" + arrivalDisplay + 
		"<td id='awayDisplay'>" + timeAway + " minutes until arrival" + "</td></tr>");
});


//reset functionality
$(".resetInput").on("click", function(event){
    location.reload();
});

//auto refresh per 1 minute passed
	//updates the train data upon refresh
	setInterval("window.location.reload()", 60000);
});

