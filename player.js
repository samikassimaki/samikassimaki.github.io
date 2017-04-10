
var player = {

// alkuasetelman koordinaatit
var x1 = 0
// alkuasetelman koordinaatit
var y1 = 0


// asetetaa  x-koordinaatti alussa
var x = x1

// asetetaan y-koordinaatti alussa
var y = y1 

var speed = 2 // nopeus

//move funktio
function move(dir) = {		
	if (dir == up) y += speed
	if (dir == down) y -= speed
	if (dir == right) x += speed
	if (dir == left) x -= speed
}

// nopeuden muutos
function changeSpeed(value) = { 
	speed = value
}

//resetoi alkuasetelmaan pelaajan sijainnin
function reset() = {
	x = x1
	y = y1
}

}