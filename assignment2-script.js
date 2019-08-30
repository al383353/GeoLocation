    
var bboxCampus = [-0.07947921752929688, 39.98619605209568, -
    0.04978179931640625, 40.00000497268461];
  
  var view=document.getElementById("mapId");
  var showBox=document.getElementById('btn-bbox');
  var showPosition=document.getElementById('btn-myposition');
  var genRandP=document.getElementById('btn-points');
  var tbody=document.getElementById("tableID");
  
  view.addEventListener("load",leafletfInitMap(mapId));          //to display the map
  showBox.addEventListener("click",handleBoundingBox);           //to display the box
  genRandP.addEventListener("click",handleRamdomPoints);         // to display the generated points
  showPosition.addEventListener("click",getMyPosition);           //to show position on map
  
  // ----------------------- ALL MY FUNCTIONS------------------------\\
  
  //Stores my current location and show it on the map
  function getMyPosition() { 
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, displayError);
      } else {
        console.log('Geolocation API is not supported');
      }
  }
  
  function getPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    isMyPosition = true;
    leafletAddPointToMap(lon, lat, isMyPosition);                    //add the point to map
  
    document.getElementById('my-lon').innerHTML=lon;  //store longitude of current location
    document.getElementById('my-lat').innerHTML=lat;  //store latitude of current location
  };
  
  function displayError(error) {
      alert("this is the error massage");
    var errors = { 
      0: 'unknown error',
      1: 'Permission denied',
      2: 'Position unavailable',
      3: 'Request timeout'
    };
    console.log("Error occurred: " + errors[error.code]);
  };
  
  // to display the box
  function handleBoundingBox() {    
    leafletAddPolygonToMap(bboxCampus);
  }
  
  // generate random points
  function handleRamdomPoints() {
     var numPoints=document.getElementById("num").value; //number of points
     var points=turf.randomPoint(numPoints, {bbox: bboxCampus});
     updateTable(numPoints, points);
  }
  
  //Function to update table with coordinates of the points and buttons
  function updateTable(numPoints, points){
    if(numPoints < 1){
      alert("You have to enter a number of points");
    }
    else{
        deleteTableRows();                          
        for(var i=0;i<numPoints;i++){
          createRow(i, points);
        }
        var showHead=document.getElementById("tableHead");
        showHead.className=" ";                             // show the table by changing class attribute
        tbody.className=" ";                            
      }
          for(var j=0;j<numPoints;j++){
              tbody.rows[j].cells[2].onclick=function() {
                handleView(this.parentElement.rowIndex); };
           }
  }
  
  function createRow(i, points){
    var tabrows=tbody.insertRow(i);              //creates one row
          var long=tabrows.insertCell(0);              //creates the first cell of the row
          var lati=tabrows.insertCell(1);              //creates the 2nd cell
          var act=tabrows.insertCell(2);               //creates the 3rd cell
  
          var longLat=turf.getCoord(points.features[i]);
  
          long.innerHTML=longLat[0];                    //placing longitude into cell
          lati.innerHTML=longLat[1];                    //placing latitude into cell
        
          var viewbtn=document.createElement("button");
          viewbtn.innerText="View";
          act.appendChild(viewbtn);
  
          tabrows.className="rowClass1";          // class of rows
          viewbtn.className ="viewBtn";           // class of view buttons
  }
  
  // Show the points on the map, hide view, and show distance
  function handleView(rid) { 
    var i=rid-1;
    var lng=tbody.rows[i].cells[0].innerHTML;
    var latt=tbody.rows[i].cells[1].innerHTML;
    leafletAddPointToMap(lng,latt);
  
    tbody.rows[i].deleteCell(-1);                 // deletes the last cell which is the cell with view button
    var dist=tbody.rows[i].insertCell(2);
    var d=document.createElement("button");
    d.innerText= "Distance";
    dist.appendChild(d);
  
    tbody.rows[i].cells[2].onclick=function() {
        handleDistance(i); };
  }
  
  // compute distance, hide distance button, and show distance label, and draw line
  function handleDistance(i) {
    var lon= document.getElementById('my-lon').innerHTML;     // longitude of current location
    var lat=document.getElementById('my-lat').innerHTML;      //latitude of current location
  
        if(lon==""){
          alert("You have to put your location first");
        }else{
          var lng=tbody.rows[i].cells[0].innerHTML;
          var latt=tbody.rows[i].cells[1].innerHTML;
          var fromp=turfToPoint(lon, lat);
          var to=turfToPoint(lng, latt);
          leafletAddLineToMap(fromp, to);
          tbody.rows[i].cells[2].innerHTML=turfDistance(fromp, to) +"KM";
        }     
   }
  
  //  Delete existing rows of the table if any 
  function deleteTableRows() {
    var rowLen= document.getElementById("tableID").rows.length;
      for(var i=0;i<rowLen;i++){    
        document.getElementById("tableID").deleteRow(0);
      }
   }