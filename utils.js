// Global variable poitne out a Leaflef map object
var map;
/*
Init a Leaflet map object.
*/
function leafletfInitMap(mapId){
    // initialize map container
    map = L.map(mapId).setView([39.994703663714745, -0.06909370422363281], 14);

    // get the stamen toner-lite tiles
    var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> — Map data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    });

    // add the tiles to the map
    Stamen_Toner.addTo(map); 

    //disable scroll wheel zoom 
    map.scrollWheelZoom.disable();
}

/* 
Add a pair lon-lat to the map. 
isMyposition is a boolean flag to determine the style of 
the circle marker. 
*/
function leafletAddPointToMap(lon, lat, isMyPosition) {
    if (map) {
        var defaultMarkerOptions = {
            radius: 4,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var myPositionMarkerOptions = {
            radius: 4,
            fillColor: "green",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var marker = turf.point([lon, lat]);
        L.geoJson(marker, {
            pointToLayer: function (feature, latlng) {
                if (isMyPosition) {
                    return L.circleMarker(latlng, myPositionMarkerOptions);
                } else {
                    return L.circleMarker(latlng, defaultMarkerOptions);
                }                
            }
        }).addTo(map);
    }
}

/* 
Add a line to the map by passing start and end points as input parameters. 
*/
function leafletAddLineToMap(pointFrom, pointTo) {

    // define coordinates for line
    var latlngs = [
        pointFrom.geometry.coordinates,
        pointTo.geometry.coordinates
    ];

    // add a marker to the map
    var line = turf.lineString(latlngs);
    L.geoJson(line, {color:"red"}).addTo(map);
}

/* 
Add a polygon to the map by passing a boundig box declaration as input parameter. 
*/
function leafletAddPolygonToMap(bbox) {
    var polygon = turfToPolygon(bbox);
    L.geoJson(polygon, {color:"blue"}).addTo(map);
}

/* 
Return a Turf Point object. 
*/
function turfToPoint(lon, lat) {
    return turf.point([lon, lat]);
   // L.geoJson(turf.point([lon, lat])).addTo(map);
}

function turfToPoint1(lon, lat) {
    return turf.point([lon, lat]);
    L.geoJson(turf.point([lon, lat])).addTo(map);
}
/* 
Return a Turf Polygon object. 
*/
function turfToPolygon(bbox) {
    return turf.bboxPolygon(bbox);
}

/* 
Return "num" random points within a determined bounding box (bbox). 
*/
function turfGenerateRamdomPoints(num, bbox) {
    var points=turf.randomPoint(num, {bbox: bbox});
    return points;
}

/* 
Return the distance (kms) between two points given as input parameters. 
*/
function turfDistance(pointFrom, pointTo) {
    var options = {units: 'kilometers'};
  
    var dist = turf.distance(pointFrom, pointTo, options);
    return parseFloat(dist).toFixed(2);
    
  }