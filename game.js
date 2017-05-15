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
var enemy = [[0, 0, 128],
			 [-10, 10, 128],
			 [1,-10, 128],
			 [10, 0, 128]];

var kiinniotettuja = 0;

var ene = 0;

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

	enemy[0][0] = 32 + (Math.random() * (canvas.width - 64));
	enemy[0][1] = 32 + (Math.random() * (canvas.height - 64));

	
	enemy[1][0] = 32 + (Math.random() * (canvas.width - 64));
	enemy[1][1] = 32 + (Math.random() * (canvas.height - 64));


	enemy[2][0] = 32 + (Math.random() * (canvas.width - 64));
	enemy[2][1] = 32 + (Math.random() * (canvas.height - 64));

	enemy[3][0] = 32 + (Math.random() * (canvas.width - 64));
	enemy[3][1] = 32 + (Math.random() * (canvas.height - 64));

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
		player.x <= (enemy[ene][0] + 32)
		&& enemy[ene][0] <= (player.x + 32)
		&& player.y <= (enemy[ene][1] + 32)
		&& enemy[ene][1] <= (player.y + 32)

	) {
		++kiinniotettuja;
		if (kiinniotettuja >= 10)  {
			if(window.alert("Olet kerännyt tarpeeksi tuulimyllyjä, sinulla on tarpeeksi sähköä!")){}
			else window.location.reload(); 
			
			var then = Date.now();
			reset();
			main();
		}
		reset();
	}

if (
		player.x <= (enemy[1][0] + 32)
		&& enemy[1][0] <= (player.x + 32)
		&& player.y <= (enemy[1][1] + 32)
		&& enemy[1][1] <= (player.y + 32)

	) {
		++kiinniotettuja;
		if (kiinniotettuja >= 10)  {
			if(window.alert("Olet kerännyt tarpeeksi tuulimyllyjä, sinulla on tarpeeksi sähköä!")){}
			else window.location.reload(); 
			
			var then = Date.now();
			reset();
			main();
		}
		reset();
	}

if (
		player.x <= (enemy[2][0] + 32)
		&& enemy[2][0] <= (player.x + 32)
		&& player.y <= (enemy[2][1] + 32)
		&& enemy[2][1] <= (player.y + 32)

	) {
		++kiinniotettuja;
		if (kiinniotettuja >= 10)  {
			if(window.alert("Olet kerännyt tarpeeksi tuulimyllyjä, sinulla on tarpeeksi sähköä!")){}
			else window.location.reload(); 
			
			var then = Date.now();
			reset();
			main();
		}
		reset();
	}

if (
		player.x <= (enemy[3][0] + 32)
		&& enemy[3][0] <= (player.x + 32)
		&& player.y <= (enemy[3][1] + 32)
		&& enemy[3][1] <= (player.y + 32)

	) {
		++kiinniotettuja;
		if (kiinniotettuja >= 1000)  {
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
		con.drawImage(vihollinen, enemy[0][0], enemy[0][1]);
		con.drawImage(vihollinen, enemy[1][0], enemy[1][1]);
		con.drawImage(vihollinen, enemy[2][0], enemy[2][1]);
		con.drawImage(vihollinen, enemy[3][0], enemy[3][1]);
	}

	// Kiinniotetut

	con.fillStyle = "rgb(250, 250, 250)";
	con.font = "24px Helvetica";
	con.textAlign = "left";
	con.textBaseline = "top";
	con.fillText("Kerättyjä tuulimyllyjä: " + kiinniotettuja, 32, 32);
};

var move = function () {

	enemy[0][0] += 1
	enemy[0][1] += 1


	enemy[1][0] += 1
	enemy[1][1] += 1


	enemy[2][0] += 1
	enemy[2][1] += 1


	enemy[3][0] += 1
	enemy[3][1] += 1


	if(enemy[0][1] < 5 ) {enemy[0][1]= 15; enemy[0][0] = 15}
	if(enemy[0][1] > (canvas.height -40)) {enemy[0][1]= 15; enemy[0][0] = 15}
	if(enemy[0][0] < 5 ) {enemy[0][1]= 15; enemy[0][0] = 15}
	if(enemy[0][0] > (canvas.width -30) ) {enemy[0][1]= 15; enemy[0][0] = 15}


	if(enemy[1][1] < 5 ) {enemy[1][1]= 30; enemy[1][0] = 30}
	if(enemy[1][1] > (canvas.height -40)) {enemy[1][1]= 30; enemy[1][0] = 30}
	if(enemy[1][0] < 5 ) {enemy[1][1]= 30; enemy[1][0] = 30}
	if(enemy[1][0] > (canvas.width -30) ) {enemy[1][1]= 30; enemy[1][0] = 30}


	if(enemy[2][1] < 5 ) {enemy[2][1]= 5; enemy[2][0] = 5}
	if(enemy[2][1] > (canvas.height -40)) {enemy[2][1]= 5; enemy[2][0] = 5}
	if(enemy[2][0] < 5 ) {enemy[2][1]= 5; enemy[2][0] = 5}
	if(enemy[2][0] > (canvas.width -30) ) {enemy[2][1]= 5; enemy[2][0] = 5}


	if(enemy[3][1] < 5 ) {enemy[3][1]= 5; enemy[3][0] = 55}
	if(enemy[3][1] > (canvas.height -40)) {enemy[3][1]= 5; enemy[3][0] = 55}
	if(enemy[3][0] < 5 ) {enemy[3][1]= 5; enemy[3][0] = 55}
	if(enemy[3][0] > (canvas.width -30) ) {enemy[3][1]= 5; enemy[3][0] = 55}

}

// Pelin pyörittäminen
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();
	move();
	then = now;
	
	

	// Kiertää koko ajan
	setInterval(main, 100);
};


var then = Date.now();
reset();

main();
