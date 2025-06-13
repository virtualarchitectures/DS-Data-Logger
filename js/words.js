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
  id++;
  countArr[this.value]++;
  var v = countArr[this.value];
  var t = inputFieldArr[this.value].value; // Get the text from input

  const { fullDate, date, time } = formatCurrentDateTime();

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
    fullDate,
    date,
    time,
  ];
  dataArr.push(currArr);

  console.log(dataArr);

  countTrackerArr[this.value].innerHTML = v;
  inputFieldArr[this.value].value = ""; // Clear the input field
  inputFieldArr[this.value].focus(); // Focus back to input field
  dataReadOut.innerHTML = currArr;

  createJson(
    id,
    currPosition.coords.latitude,
    currPosition.coords.longitude,
    currPosition.coords.altitude,
    currPosition.coords.timestamp,
    fullDate,
    date,
    time,
    {
      button_id: Number(this.value),
      button_label: this.innerHTML,
      count: v,
      text: t,
    }
  );
  mapJson();
}

//----------GEOLOCATION AND EVENT LISTENERS----------//

// Geolocation initialization
getGeolocation();

// Add event listeners to buttons
resetDataBtn.addEventListener("click", () =>
  resetData(
    dataArr,
    dataHead,
    countArr,
    countTrackerArr,
    myJson,
    map,
    geoJsonLayer
  )
);
exportCSVBtn.addEventListener("click", exportCSV);
exportGeoJsonBtn.addEventListener("click", exportJson);

addButton.addEventListener("click", countPress);
