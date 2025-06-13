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
      radius: Math.abs(feature.properties.range_value) + 1,
      fillColor: getColorByRangeValue(feature.properties.range_value),
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    });
  },
}).addTo(map);

//----------UTILITY FUNCTIONS----------//

// Function to determine the circle color based on range value
function getColorByRangeValue(range_value) {
  return range_value < 0 ? "#FFED6F" : "#C97CF7";
}

//----------GEOJSON DATA MANAGEMENT----------//

// GeoJSON data object initialization
var myJson = {
  type: "FeatureCollection",
  features: [],
};

// Function to create a GeoJSON feature
function createJson(
  id,
  button_id,
  button_label,
  count,
  range_value,
  latitude,
  longitude,
  altitude,
  timestamp,
  iso_date,
  date,
  time
) {
  console.log("Adding to GeoJSON");
  if (altitude === null) {
    myJson.features.push({
      type: "Feature",
      properties: {
        id: id,
        button_id: button_id,
        button_label: button_label,
        count: count,
        range_value: range_value,
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
        range_value: range_value,
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

// Variables for geolocation, time, buttons, and data initialization
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
  "range_value",
  "latitude",
  "longitude",
  "altitude",
  "timestamp",
  "iso-date",
  "date",
  "time",
];
var dataArr = [dataHead];

// Button and range tracker variables initialization
var addButton1 = document.getElementById("adder1");
buttonLabel1.value = addButton1.innerHTML;

var countTracker1 = document.getElementById("countNumberTracker1");
countTracker1.innerHTML = 0;

var rangeInput1 = document.getElementById("rangeInput1");
var rangeTracker1 = document.getElementById("rangeTracker1");
var rangeMin1 = document.getElementById("rangeMin1");
var rangeMax1 = document.getElementById("rangeMax1");

rangeMin1.value = rangeInput1.min;
rangeMax1.value = rangeInput1.max;

// Editing related variables
var currEdit = false;
var editBtn = document.getElementById("edit");

// Array to store counts
var countArr = [0];

// Storing button id values
addButton1.value = 0;

var buttonArr = [addButton1];
var countTrackerArr = [countTracker1];
var rangeInputArr = [rangeInput1];

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
  var r = rangeInputArr[this.value].value; // Get range value

  var currArr = [
    id,
    Number(this.value),
    this.innerHTML,
    v,
    Number(r),
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
  dataReadOut.innerHTML = currArr;

  createJson(
    id,
    Number(this.value),
    this.innerHTML,
    v,
    Number(r),
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

// Function to handle edit/save button logic
function editPress() {
  currEdit = !currEdit;
  if (currEdit) {
    editBtn.innerHTML = "Save";

    buttonLabel1.style.visibility = "visible";
    rangeMin1.style.visibility = "visible";
    rangeMax1.style.visibility = "visible";

    addButton1.classList.toggle("inactive-button");
  } else {
    editBtn.innerHTML = "Edit";

    buttonLabel1.style.visibility = "hidden";
    addButton1.innerHTML = buttonLabel1.value;

    rangeMin1.style.visibility = "hidden";
    rangeMax1.style.visibility = "hidden";

    rangeInput1.min = rangeMin1.value; // Update range input minimum
    rangeInput1.max = rangeMax1.value; // Update range input maximum

    addButton1.classList.toggle("inactive-button");
  }
}

// Function to update the displayed range value
function updateRangeValue(v) {
  rangeTracker1.innerHTML = "current value = " + v;
}

//----------GEOLOCATION AND EVENT LISTENERS----------//

// Geolocation initialization
getGeolocation();

// Add event listeners to buttons
resetDataBtn.addEventListener("click", resetData);
exportCSVBtn.addEventListener("click", exportCSV2);
exportGeoJsonBtn.addEventListener("click", exportJson2);

addButton1.addEventListener("click", countPress);

editBtn.addEventListener("click", editPress);
