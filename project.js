window.onload = function() {
    
    // Itse peli, 
    var game = new Phaser.Game(320,320,Phaser.CANVAS,"",{preload:onPreload, create:onCreate});                
    
    // Vakiot, joissa pelin elementit
    var TYHJA = 0;
     var SEINA = 1;
     var MAALI = 2;
     var LAATIKKO = 3;
     var PLAYER = 4;
     // Jos pisteen päällä on jotain muuta, niiden arvo on yhteen laskettu
    

    var allLevels = [
                     [[1,1,1,1,1,1,1,1],
                      [1,0,0,1,1,1,1,1],
                      [1,0,0,1,1,1,1,1],
                      [1,0,0,0,0,0,0,1],
                      [1,1,4,2,1,3,0,1],
                      [1,0,0,0,1,0,0,1],
                      [1,0,0,0,1,1,1,1],
                      [1,1,1,1,1,1,1,1]],

                     [[1,1,1,1,1,1,1,1],
                      [1,0,0,1,0,0,2,1],
                      [1,0,3,1,0,0,0,1],
                      [1,0,0,0,0,0,0,1],
                      [1,1,4,2,1,3,0,1],
                      [1,0,0,0,0,0,0,1],
                      [1,0,0,0,1,1,1,1],
                      [1,1,1,1,1,1,1,1]]
                      ];


    var levelNumber = prompt("Valitse taso välillä 1 - 2", "1");
    if (levelNumber > allLevels.length) levelNumber = 2;
    if (levelNumber < 1) levelNumber = 1;

    // Valittu taso
    var level = allLevels[levelNumber - 1];
    
    // Pitää kirjaa edellisistä siirroista
    var undoArray = [];
    
    // Pitää kirjaa laatikoista
    var laatikot = [];
    
    // Yhden laatikon koko pikseleissä
     var tileSize = 40;
     
     // Pelaaja
     var player;
     
     // Liikkuuko pelaaja
     var playerMoving = false;
    
     // Jaetaan liikkuviin ja liikkumattomiin
     var liikkumaton;
     var liikkuva;
 
     // Sprite sheetin lataaminen alussa, sekä pelin keskittäminen ja Full Screen
    function onPreload() {
        game.load.spritesheet("tiles","tiles.png",40,40);
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
 
    // Peliä luotaessa kutsutaan
    function onCreate() {
        // Odottaa näppäimistön painallusta
        game.input.keyboard.addCallbacks(this,onDown);
        // Piirtää tason
        drawLevel();      
    }

    //???
    function drawLevel(){  
          // Tyhjennetään laatikko Array
          laatikot.length = 0;      
        // Lisää ryhmät peliin
          liikkumaton = game.add.group();
          liikkuva = game.add.group();
          
          // Tiilien luomista varten
          var tile
          // Käydään jokainen läpi
        for(var i=0;i<level.length;i++){
            // creation of 2nd dimension of laatikot array
               laatikot[i]= [];
               // looping through all level columns
            for(var j=0;j<level[i].length;j++){
                // by default, there are no laatikot at current level position, so we set to null its
                // array entry
                    laatikot[i][j] = null;
                    // what do we have at row j, col i
                switch(level[i][j]){
                         case PLAYER:
                         case PLAYER+MAALI:
                            // Pelaajan luominen
                              player = game.add.sprite(40*j,40*i,"tiles");
                              // Pelaajan frame omaan frameen
                        player.frame = level[i][j];
                              // Pelaajan paikan määrittämiseen tarvittavat muuttujat
                              player.posX = j;
                              player.posY = i;
                              // Pelaaja lisätään liikkuvaan ryhmään
                              liikkuva.add(player);
                              // since the player is on the floor, I am also creating the floor tile
                              tile = game.add.sprite(40*j,40*i,"tiles");
                          tile.frame = level[i][j]-PLAYER;
                          // Lattia ei liiku
                              liikkumaton.add(tile);
                              break;
                         case LAATIKKO:
                         case LAATIKKO+MAALI:
                            // crate creation, both as a sprite and as a laatikot array item
                              laatikot[i][j] = game.add.sprite(40*j,40*i,"tiles");
                              // assigning the crate the proper frame
                              laatikot[i][j].frame = level[i][j];
                              // adding the crate to movingGroup
                              liikkuva.add(laatikot[i][j]);
                              // since the create is on the floor, I am also creating the floor tile
                              tile = game.add.sprite(40*j,40*i,"tiles");
                          tile.frame = level[i][j]-LAATIKKO;
                          // floor does not move so I am adding it to fixedGroup
                              liikkumaton.add(tile);                              
                              break;
                         default:
                            // creation of a simple tile
                              tile = game.add.sprite(40*j,40*i,"tiles");
                          tile.frame = level[i][j];
                              liikkumaton.add(tile);
                    }
            }
        }
    }
    
    // Näppäimistö-inputin vastaan ottamiseen
    function onDown(e){
        // Jos pelaaja ei liiku
        if(!playerMoving){
            switch(e.keyCode){
                // vasen
                case 37:
                    move(-1,0);
                    break;
                // ylös
                case 38:
                    move(0,-1);
                    break;
                // oikea
                case 39:
                    move(1,0);
                    break;
                // alas
                case 40:
                    move(0,1);
                    break;
                // edellinen
                case 85:
                    // Tarkastetaan onko jotain poistettavaa
                    if(undoArray.length>0){
                        // Poistetaan viimeinen siirto edellisestä
                        var undoLevel = undoArray.pop();
                        liikkumaton.destroy();
                        liikkuva.destroy();
                        level = [];
                        level = copyArray(undoLevel);
                        drawLevel();
                    }
                    break;
            }
        }
    }
    
     // Pelaajan  siirtäminen
     function move(deltaX,deltaY){

        // Tarkastaa pystyykö tiilelle liikkumaan
          if(isWalkable(player.posX+deltaX,player.posY+deltaY)){
            // Nykyinen tilanne edellisten siirtojen listaan 
            undoArray.push(copyArray(level));
               // Siirrä pelaaja ja lopeta.
            movePlayer(deltaX,deltaY);
            return;
          }
          // Jos laatikko on siirtymissuunnassa
          if(isCrate(player.posX+deltaX,player.posY+deltaY)){
            // Jos laatikon suuntaan pääsee liikkumaan...
               if(isWalkable(player.posX+2*deltaX,player.posY+2*deltaY)){
                // Tilanne edellisten listaan
                undoArray.push(copyArray(level));
                // Siirrä laatikkoa
                    moveCrate(deltaX,deltaY);             
                    // Siirrä pelaajaa 
                movePlayer(deltaX,deltaY);
               }
          }

     }
     
     // Onko tiili käveltäbä, eli tyhjä tai maalipiste
     function isWalkable(posX,posY){
        return level[posY][posX] == TYHJA || level[posY][posX] == MAALI;
    }
    
    // Laatikko on laatikko tai laatikko on maalipisteellä
    function isCrate(posX,posY){
        return level[posY][posX] == LAATIKKO || level[posY][posX] == LAATIKKO+MAALI;
    }
    
    // Pelaajan siirtämistä varten
    function movePlayer(deltaX,deltaY){
        // Pelaaja liikkuu
        playerMoving = true;
        // Liikkumisnopeus
        var playerTween =game.add.tween(player);
        playerTween.to({
            x:player.x+deltaX*tileSize,
            y:player.y + deltaY*tileSize
        }, 100, Phaser.Easing.Linear.None,true);
        // Kun liikkuminen on loppu
        playerTween.onComplete.add(function(){
            // Liike loppuu
            playerMoving = false;
            if(levelSolved()){
                  if(window.alert("Olet kerännyt tarpeeksi tuulimyllyjä, sinulla on tarpeeksi sähköä!")){}
                  else window.location.reload(); 
                };
        }, this);
        // Poistaa pelaajan edellisen paikan peli Arrayssa
          level[player.posY][player.posX]-=PLAYER;  
          // Päivittää uuden koordinaatin 
          player.posX+=deltaX;
          player.posY+=deltaY;
          // Lisää pelaajan peli Arrayhyn
          level[player.posY][player.posX]+=PLAYER;  
        // siirtää pelaaja framen paikkaa
          player.frame = level[player.posY][player.posX];

    }
    
    // Laatikon siirto funktio
    function moveCrate(deltaX,deltaY){
        // Liikkumisaika
        var crateTween =game.add.tween(laatikot[player.posY+deltaY][player.posX+deltaX]);
        crateTween.to({
            x:laatikot[player.posY+deltaY][player.posX+deltaX].x+deltaX*tileSize,
            y:laatikot[player.posY+deltaY][player.posX+deltaX].y+deltaY*tileSize,
        }, 100, Phaser.Easing.Linear.None,true);
        // Crate arrayn päivittäminen
          laatikot[player.posY+2*deltaY][player.posX+2*deltaX]=laatikot[player.posY+deltaY][player.posX+deltaX];
          laatikot[player.posY+deltaY][player.posX+deltaX]=null;
          // Vanhan position päivittäminen
          level[player.posY+deltaY][player.posX+deltaX]-=LAATIKKO;
          // Uuden position päivittäminen
        level[player.posY+2*deltaY][player.posX+2*deltaX]+=LAATIKKO;
        // Laatikko framen siirtäminen
        laatikot[player.posY+2*deltaY][player.posX+2*deltaX].frame=level[player.posY+2*deltaY][player.posX+2*deltaX];
    }
    
    
    function levelSolved(){
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                if(level[i][j] == LAATIKKO){
                    return false;
                }
            }
        }
        return true;
    }

    // Arrayn kopioiminen
    function copyArray(a){
        var newArray = a.slice(0);
            for(var i = newArray.length; i>0; i--){
            if(newArray[i] instanceof Array){
                newArray[i] = copyArray(newArray[i]);   
            }
        }
        return newArray;
    }
}