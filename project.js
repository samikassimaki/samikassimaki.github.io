window.onload = function() {
    
    // Itse peli
    var peli = new Phaser.Game(320,320,Phaser.CANVAS,"",{preload:ladatessa, create:luotaessa});   

    
    // Vakiot, joissa pelin elementit
     var TYHJA = 0;
     var SEINA = 1;
     var MAALI = 2;
     var LAATIKKO = 3;
     var PELAAJA = 4;
     // Jos pisteen päällä on jotain muuta, niiden arvo on yhteen laskettu
    

    var kaikkiTasot = [
                     [[1,1,1,1,1,1,1,1],
                      [1,0,0,1,0,0,2,1],
                      [1,0,3,1,0,0,0,1],
                      [1,0,0,0,0,0,0,1],
                      [1,1,4,2,1,3,0,1],
                      [1,0,0,0,0,0,0,1],
                      [1,0,0,0,1,1,1,1],
                      [1,1,1,1,1,1,1,1]],
					  
					           [[1,1,1,1,1,1,1,1],
                      [1,2,1,0,0,0,0,1],
                      [1,0,1,0,0,3,0,1],
                      [1,0,0,0,1,1,1,1],
                      [1,1,3,0,0,0,2,1],
                      [1,0,0,1,1,1,0,1],
                      [1,2,0,0,4,3,0,1],
                      [1,1,1,1,1,1,1,1]],
					  
				          	 [[1,1,1,1,1,1,1,1],
                      [1,1,1,1,0,0,0,1],
                      [1,0,0,0,0,0,0,1],
                      [1,0,0,2,1,3,1,1],
                      [1,1,3,1,2,0,0,1],
                      [1,4,0,0,0,0,0,1],
                      [1,0,0,0,0,0,1,1],
                      [1,1,1,1,1,1,1,1]]
					 ];


    var tasot = prompt("Rakenna oma tuulipuistosi! Valitse taso 1 - 3", "1");
    
	  if (tasot > kaikkiTasot.length) tasot = 3;
	  if (tasot == 2) tasot = 2;
    if (tasot < 1) tasot = 1;

    // Valittu taso
    var taso = kaikkiTasot[tasot - 1];
    
    // Pitää kirjaa edellisistä siirroista
    var edellisetSiirrot = [];
    
    // Pitää kirjaa laatikoista
    var laatikot = [];
    
    // Yhden laatikon koko pikseleissä
     var tiilenKoko = 40;
     
     // Pelaaja
     var pelaaja;
     
     // Liikkuuko pelaaja
     var pelaajaLiikkuu = false;
    
     // Jaetaan liikkuviin ja liikkumattomiin
     var liikkumaton;
     var liikkuva;
 
     // Sprite sheetin lataaminen alussa, sekä pelin keskittäminen ja Full Screen
    function ladatessa() {
        peli.load.spritesheet("tiilet","tiles.png",40,40);
        peli.scale.pageAlignHorizontally = true;
        peli.scale.pageAlignVertically = true;
        peli.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        var voitto = new Audio('voitto.mp3')
    }
 
    // Peliä luotaessa kutsutaan
    function luotaessa() {
        // Odottaa näppäimistön painallusta
        peli.input.keyboard.addCallbacks(this,onDown);
        // Piirtää tason
        piirraTaso();    
        

    }

    function piirraTaso(){  
          // Tyhjennetään laatikko Array
          laatikot.length = 0;      
        // Lisää ryhmät peliin
          liikkumaton = peli.add.group();
          liikkuva = peli.add.group();
          
          // Tiilien luomista varten
          var tiili
          // Käydään jokainen läpi
        for(var i=0;i<taso.length;i++){
            // Laatikoiden paikat
               laatikot[i]= [];
               // tason kaikki 
            for(var j=0;j<taso[i].length;j++){
                // vakiona paikalla ei ole laatikoita, joten asetetaan null
                laatikot[i][j] = null;
                // mitä sijaitsee tasossa, piirretään kuvioita
                switch(taso[i][j]){
                         case PELAAJA:
                         case PELAAJA+MAALI:
                              // Pelaajan luominen
                              pelaaja = peli.add.sprite(40*j,40*i,"tiilet");
                              // Pelaajan frame omaan paikkaansa tasossa
                              pelaaja.frame = taso[i][j];
                              // Pelaajan paikan määrittämiseen tarvittavat muuttujat
                              pelaaja.posX = j;
                              pelaaja.posY = i;
                              // Pelaaja lisätään liikkuvaan ryhmään
                              liikkuva.add(pelaaja);
                              // Koska pelaaja on lattialla, lisätään kohtaan myös lattia tiili
                              tiili = peli.add.sprite(40*j,40*i,"tiilet");
                              tiili.frame = taso[i][j]-pelaaja;
                              // Lattia ei liiku
                              liikkumaton.add(tiili);
                              break;
                         case LAATIKKO:
                         case LAATIKKO+MAALI:
                              // luodaan laatikko sekä laatikot arrayhyn, että kuvaan
                              laatikot[i][j] = peli.add.sprite(40*j,40*i,"tiilet");
                              // sijoitetaan laatikko paikalleen
                              laatikot[i][j].frame = taso[i][j];
                              // lisätään laatikko liikkuvien ryhmään
                              liikkuva.add(laatikot[i][j]);
                              // laatikko on lattialla, joten paikalle luodaan myös lattia
                              tiili = peli.add.sprite(40*j,40*i,"tiilet");
                              tiili.frame = taso[i][j]-LAATIKKO;
                              // lattia ei liiku
                              liikkumaton.add(tiili);                              
                              break;
                         default:
                              // Liikkumattoman seinän luonti
                              tiili = peli.add.sprite(40*j,40*i,"tiilet");
                              tiili.frame = taso[i][j];
                              liikkumaton.add(tiili);
                    }
            }
        }
    }
    
    // Näppäimistö-inputin vastaan ottamiseen
    function onDown(e){
        // Jos pelaaja ei liiku
        if(!pelaajaLiikkuu){
            switch(e.keyCode){
                // vasen
                case 37:
                    liiku(-1,0);
                    break;
                // ylös
                case 38:
                    liiku(0,-1);
                    break;
                // oikea
                case 39:
                    liiku(1,0);
                    break;
                // alas
                case 40:
                    liiku(0,1);
                    break;
                // edellinen
                case 85:
                    // Tarkastetaan onko jotain poistettavaa
                    if(edellisetSiirrot.length>0){
                        // Poistetaan viimeinen siirto edellisestä
                        var edellinen = edellisetSiirrot.pop();
                        liikkumaton.destroy();
                        liikkuva.destroy();
                        taso = [];
                        taso = kopio(edellinen);
                        piirraTaso();
                    }
                    break;
            }
        }
    }
    
     // Pelaajan  siirtäminen
     function liiku(deltaX,deltaY){

        // Tarkastaa pystyykö tiilelle liikkumaan
          if(kaveltava(pelaaja.posX+deltaX,pelaaja.posY+deltaY)){
            // Nykyinen tilanne edellisten siirtojen listaan 
            edellisetSiirrot.push(kopio(taso));
            // Siirrä pelaaja ja lopeta.
            liikutaPelaajaa(deltaX,deltaY);
            return;
          }
          // Jos laatikko on siirtymissuunnassa
          if(onkoLaatikko(pelaaja.posX+deltaX,pelaaja.posY+deltaY)){
            // Jos laatikon suuntaan pääsee liikkumaan...
             if(kaveltava(pelaaja.posX+2*deltaX,pelaaja.posY+2*deltaY)){
                // Tilanne edellisten listaan
                edellisetSiirrot.push(kopio(taso));
                // Siirrä laatikkoa
                liikutaLaatikko(deltaX,deltaY);             
                // Siirrä pelaajaa 
                liikutaPelaajaa(deltaX,deltaY);
             }
          }

     }
     
     // Onko tiili käveltävä, eli tyhjä tai maalipiste
     function kaveltava(posX,posY){
        return taso[posY][posX] == TYHJA || taso[posY][posX] == MAALI;
    }
    
    // Laatikko on laatikko tai laatikko on maalipisteellä
    function onkoLaatikko(posX,posY){
        return taso[posY][posX] == LAATIKKO || taso[posY][posX] == LAATIKKO+MAALI;
    }
    
    // Pelaajan siirtämistä varten
    function liikutaPelaajaa(deltaX,deltaY){
        // Pelaaja liikkuu
        pelaajaLiikkuu = true;
        // Liikkumisnopeus
        var pelaajaTween =peli.add.tween(pelaaja);
        pelaajaTween.to({
            x:pelaaja.x+deltaX*tiilenKoko,
            y:pelaaja.y + deltaY*tiilenKoko
        }, 100, Phaser.Easing.Linear.None,true);
        // Kun liikkuminen on loppu
        pelaajaTween.onComplete.add(function(){
            // Liike loppuu
            pelaajaLiikkuu = false;
            if(tasoValmis()){
                 voitto.play();
                 alert("Olet kerännyt tarpeeksi tuulimyllyjä, sinulla on tarpeeksi sähköä!"));
                 window.location.reload(); 
                };
        }, this);
        // Poistaa pelaajan edellisen paikan peli Arrayssa
          taso[pelaaja.posY][pelaaja.posX]-=PELAAJA;  
          // Päivittää uuden koordinaatin 
          pelaaja.posX+=deltaX;
          pelaaja.posY+=deltaY;
          // Lisää pelaajan peli Arrayhyn
          taso[pelaaja.posY][pelaaja.posX]+=PELAAJA;  
        // siirtää pelaaja framen paikkaa
          pelaaja.frame = taso[pelaaja.posY][pelaaja.posX];

    }
    
    // Laatikon siirto funktio
    function liikutaLaatikko(deltaX,deltaY){
        // Liikkumisaika
        var crateTween =peli.add.tween(laatikot[pelaaja.posY+deltaY][pelaaja.posX+deltaX]);
        crateTween.to({
            x:laatikot[pelaaja.posY+deltaY][pelaaja.posX+deltaX].x+deltaX*tiilenKoko,
            y:laatikot[pelaaja.posY+deltaY][pelaaja.posX+deltaX].y+deltaY*tiilenKoko,
        }, 100, Phaser.Easing.Linear.None,true);
        // Crate arrayn päivittäminen
          laatikot[pelaaja.posY+2*deltaY][pelaaja.posX+2*deltaX]=laatikot[pelaaja.posY+deltaY][pelaaja.posX+deltaX];
          laatikot[pelaaja.posY+deltaY][pelaaja.posX+deltaX]=null;
          // Vanhan position päivittäminen
          taso[pelaaja.posY+deltaY][pelaaja.posX+deltaX]-=LAATIKKO;
          // Uuden position päivittäminen
        taso[pelaaja.posY+2*deltaY][pelaaja.posX+2*deltaX]+=LAATIKKO;
        // Laatikko framen siirtäminen
        laatikot[pelaaja.posY+2*deltaY][pelaaja.posX+2*deltaX].frame=taso[pelaaja.posY+2*deltaY][pelaaja.posX+2*deltaX];
    }
    
    
    function tasoValmis(){
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                if(taso[i][j] == LAATIKKO){
                    return false;
                }
            }
        }
        return true;
    }

    // Arrayn kopioiminen
    function kopio(a){
        var newArray = a.slice(0);
            for(var i = newArray.length; i>0; i--){
            if(newArray[i] instanceof Array){
                newArray[i] = kopio(newArray[i]);   
            }
        }
        return newArray;
    }
}