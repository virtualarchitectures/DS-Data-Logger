//----------MAP INITIALIZATION----------//

// Initialize a Leaflet map instance
var map = L.map("map").setView([53.35014, -6.266155], 9);

// Add a tile layer using OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

// Initialize an empty GeoJSON layer for displaying data points on the map
var geoJsonLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: "#C97CF7",
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    });
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.text); // Attach a popup with text from GeoJSON properties
  },
}).addTo(map);

//----------GEOJSON DATA MANAGEMENT----------//

// Function to create a GeoJSON feature and add it to the data object
var myJson = {
  type: "FeatureCollection",
  features: [],
};

function createJson(
  id,
  button_id,
  button_label,
  count,
  the_text,
  latitude,
  longitude,
  altitude,
  timestamp,
  iso_date,
  date,
  time
) {
  console.log("blah blah json");
  if (altitude === null) {
    myJson.features.push({
      type: "Feature",
      properties: {
        id: id,
        button_id: button_id,
        button_label: button_label,
        count: count,
        text: the_text, // Store the text property
        timestamp: timestamp,
        "iso-date": iso_date,
        date: date,
        time: time,
      },
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });
  } else {
    myJson.features.push({
      type: "Feature",
      properties: {
        id: id,
        button_id: button_id,
        button_label: button_label,
        count: count,
        text: the_text,
        timestamp: timestamp,
        "iso-date": iso_date,
        date: date,
        time: time,
      },
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude, altitude],
      },
    });
  }
  console.log(myJson);
}

//----------VARIABLE INITIALIZATION----------//

// Variables for geolocation, time, and data initialization
var geoEnabled = document.getElementById("geo-enabled");
var dataReadOut = document.getElementById("read-out");

var currPosition;
var currDate = new Date();

var resetDataBtn = document.getElementById("resetData");
var exportCSVBtn = document.getElementById("exportCSV");
var exportGeoJsonBtn = document.getElementById("exportGeoJson");

var id = 0;
var dataHead = [
  "id",
  "button_id",
  "label",
  "count",
  "text",
  "latitude",
  "longitude",
  "altitude",
  "timestamp",
  "iso-date",
  "date",
  "time",
];
var dataArr = [dataHead];

// Button and input field variables initialization
var addButton = document.getElementById("adder");

var countTracker1 = document.getElementById("countNumberTracker1");
countTracker1.innerHTML = 0;

var inputField1 = document.getElementById("inputField1");

// Arrays and count storage
var countArr = [0];
addButton.value = 0;

var buttonArr = [addButton];
var countTrackerArr = [countTracker1];
var inputFieldArr = [inputField1];

//----------BUTTON INTERACTION LOGIC----------//

// Function to handle button press logic
function countPress() {
  currDate = new Date();
  let yr = currDate.getFullYear();
  let mo = currDate.getMonth() + 1;
  let dt = currDate.getDate();
  let hr = currDate.getHours();
  let mn = currDate.getMinutes();
  let sc = currDate.getSeconds();

  // Add leading zeros to date/time values
  if (mo < 10) {
    mo = "0" + mo;
  }
  if (dt < 10) {
    dt = "0" + dt;
  }
  if (hr < 10) {
    hr = "0" + hr;
  }
  if (mn < 10) {
    mn = "0" + mn;
  }
  if (sc < 10) {
    sc = "0" + sc;
  }

  id++;
  countArr[this.value]++;
  var v = countArr[this.value];
  var t = inputFieldArr[this.value].value; // Get the text from input

  var currArr = [
    id,
    Number(this.value),
    this.innerHTML,
    v,
    '"' + t + '"', // Store text with quotes
    currPosition.coords.latitude,
    currPosition.coords.longitude,
    currPosition.coords.altitude,
    currPosition.coords.timestamp,
    yr + "-" + mo + "-" + dt + "T" + hr + ":" + mn + ":" + sc,
    yr + "-" + mo + "-" + dt,
    hr + ":" + mn + ":" + sc,
  ];
  dataArr.push(currArr);

  console.log(dataArr);

  countTrackerArr[this.value].innerHTML = v;
  inputFieldArr[this.value].value = ""; // Clear the input field
  inputFieldArr[this.value].focus(); // Focus back to input field
  dataReadOut.innerHTML = currArr;

  createJson(
    id,
    Number(this.value),
    this.innerHTML,
    v,
    t,
    currPosition.coords.latitude,
    currPosition.coords.longitude,
    currPosition.coords.altitude,
    currPosition.coords.timestamp,
    yr + "-" + mo + "-" + dt + "T" + hr + ":" + mn + ":" + sc,
    yr + "-" + mo + "-" + dt,
    hr + ":" + mn + ":" + sc
  );
  mapJson();
}

// Function to reset data and GeoJSON object
function resetData() {
  id = 0;
  dataArr = [dataHead];
  countArr = [0];
  countTracker1.innerHTML = 0;

  myJson = {
    type: "FeatureCollection",
    features: [],
  };
  console.log(dataArr);
}

//----------GEOLOCATION AND EVENT LISTENERS----------//

// Geolocation initialization
getGeolocation();

// Add event listeners to buttons
resetDataBtn.addEventListener("click", resetData);
exportCSVBtn.addEventListener("click", exportCSV2);
exportGeoJsonBtn.addEventListener("click", exportJson2);

addButton.addEventListener("click", countPress);
