// Canvas

var canvas = document.createElement("canvas");
var con = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);

// Taustakuva

var taustaValmis = false;
var tausta = new Image;
tausta.onload = function () {taustaValmis = true}
tausta.src = "tausta.png";

// Pelaajan kuva
var playerValmis = false;
var pelaaja = new Image;
pelaaja.onload = function () {playerValmis = true}
pelaaja.src = "player.png";

// Vihollisen kuva
var enemyValmis = false;
var vihollinen = new Image;
vihollinen.onload = function () {enemyValmis = true}
vihollinen.src = "enemy.png";



// Pelaaja
var player = {

// Koordinaatit
x: 0,
y: 0,

speed: 256 // nopeus pikseleitä sekunnissa
};


// Vihollinen
var enemy = {
	x: 0,
	y: 0,
	speed: 128
};

var kiinniotettuja = 0;

var keysDown = {};

addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
}, false)

addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
}, false)


// Sijoittaa pelaajan keskelle ruutua
var reset = function () {
	player.x = canvas.width / 2
	player.y = canvas.height / 2


// Uusi vihollinen satunnaiseen paikkaan

enemy.x = 32 + (Math.random() * (canvas.width - 64));
enemy.y = 32 + (Math.random() * (canvas.height - 64));
}


// Vaihda pelaajan paikkaan

var update = function (modifier) {
	if (38 in keysDown) { // Ylös-näppäin pohjassa
		player.y -= player.speed * modifier;	
		
	}
	if (40 in keysDown) { // Alas-näppäin pohjassa
		player.y += player.speed * modifier
		
	}
	if (37 in keysDown) { // Vasen-näppäin pohjassa
		player.x -= player.speed * modifier;
		
	}
	if (39 in keysDown) { // Oikea-näppäin pohhjassa
		player.x += player.speed * modifier;
	
	}
	if(player.y < 5 ) {player.y = 5}
	if (player.y > (canvas.height -40)) {player.y = (canvas.height - 40)}
	if(player.x < 5 ) {player.x = 5}
	if(player.x > (canvas.width -30) ) {player.x = (canvas.width-30)}

var changeSpeed = function (amount) {
	player.speed += amount
}

// Onko saatu kiinni?
if (
		player.x <= (enemy.x + 32)
		&& enemy.x <= (player.x + 32)
		&& player.y <= (enemy.y + 32)
		&& enemy.y <= (player.y + 32)

	) {
		++kiinniotettuja;
		if (kiinniotettuja == 5)  {
			if(window.alert("Olet kerännyt tarpeeksi tuulimyllyjä, sinulla on tarpeeksi sähköä!")){}
			else window.location.reload(); 
			
			var then = Date.now();
			reset();
			main();
		}
		reset();
	}
};


// Piirtää 
var render = function () {
	if (taustaValmis) {
		con.drawImage(tausta, 0, 0);
	}

	if (playerValmis) {
		con.drawImage(pelaaja, player.x, player.y);
	}

	if (enemyValmis) {
		con.drawImage(vihollinen, enemy.x, enemy.y);
	}

	// Kiinniotetut

	con.fillStyle = "rgb(250, 250, 250)";
	con.font = "24px Helvetica";
	con.textAlign = "left";
	con.textBaseline = "top";
	con.fillText("Kerättyjä tuulimyllyjä: " + kiinniotettuja, 32, 32);
};




// Pelin pyörittäminen
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Kiertää koko ajan
	requestAnimationFrame(main);
};


var then = Date.now();
reset();
main();