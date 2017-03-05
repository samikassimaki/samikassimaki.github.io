
function getRandomInteger(min, max) {
	return randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
}

var randomInt = getRandomInteger(1, 10)

function compareNumbers(first, second) {
	return first == second;
}

function guessTheNumber() {

	var num = document.getElementById('number').value;

	if(!isInt(num)) {
		alert("Given number isn't viable. Give a number between 1-10.")
	}
	else {
		if (this.compareNumbers(num, randomInt)) {
			randomInt = getRandomInteger(1,10)
			alert("Right guess!")
		}
		else {
			randomInt = getRandomInteger(1,10)
			alert("Wrong guess!")
		}
	}
}

function isInt(value) {
	return (value%1 == 0) && (value >= 1) && (value <= 10);
}