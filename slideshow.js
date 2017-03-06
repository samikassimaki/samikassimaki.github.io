$.getJSON("https://kassims1-a8fe3.firebaseio.com/.json",function(data) {console.log(data)});

var slideIndex = 1;
slider();

var uutiset = $.getJSON("https://kassims1-a8fe3.firebaseio.com/.json", function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li id='" + key + "'>" + val + "</li>" );
  });
 
  $( "<ul/>", {
    "class": "uutiset",
    html: items.join( " " )
  }).appendTo( "#media" );
});

var slideIndex = 0;
carousel();

function slider() {
    var a;
    var b = document.getElementsByClassName("uutiset");
    for (a = 0; a < b.length; i++) {
      var a = b[i].style.display = "none"; 
    }
    slideIndex++;
    if (slideIndex > b.length) {slideIndex = 1} 
    b[slideIndex-1].style.display = "block"; 
    setTimeout(slider, 3000);
}