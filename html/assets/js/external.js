var elementID = document.getElementById('item-detail');

if( elementID ){
    var path = "../../";
}
else {
    path = "../";
}

var element = document.querySelector('body');

if( hasClass(element, 'external') ){
    loadCss();
}
else {
    simpleMap(_latitude, _longitude,draggableMarker, scrollwheel);
    rating();
    averageColor( $('.content-container') );
}

function loadJquery(){
    loadScript( path + "js/jquery-2.1.0.min.js", jQueryLoaded);
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function loadScript(url, callback)
{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}

function loadCss(){
    var cssArray = [
        path + "fonts/font-awesome.css",
        "http://fonts.googleapis.com/css?family=Roboto:700,400,300",
        path + "bootstrap/css/bootstrap.min.css",
        path + "css/style.css"
    ];
    for( var i=0; i<cssArray.length; i++ ){
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel  = 'stylesheet';
        link.href = cssArray[i];
        head.appendChild(link);
        if( i == cssArray.length-1 ){
            loadScript( path + "js/functions.js", loadJquery );
        }
    }
}