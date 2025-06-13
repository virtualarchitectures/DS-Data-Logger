// Initialize Leaflet map
var map = L.map("map").setView([53.35014, -6.266155], 9);

// Add a tile layer (using OpenStreetMap as an example)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

// Initialize an empty GeoJSON layer
var geoJsonLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8, // Circle radius
      fillColor: "#C97CF7",
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    });
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.text); // Display the text from GeoJSON properties
  },
}).addTo(map);

// Initialize the GeoJSON data object
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
        text: the_text,
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

// Variables for geo, time, buttons, data
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

function countPress() {
  currDate = new Date();
  let yr = currDate.getFullYear();
  let mo = currDate.getMonth() + 1;
  let dt = currDate.getDate();
  let hr = currDate.getHours();
  let mn = currDate.getMinutes();
  let sc = currDate.getSeconds();

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
  var t = inputFieldArr[this.value].value;

  var currArr = [
    id,
    Number(this.value),
    this.innerHTML,
    v,
    '"' + t + '"',
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
  inputFieldArr[this.value].value = "";
  inputFieldArr[this.value].focus();
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

function resetData() {
  id = 0;
  dataArr = [dataHead];
  countArr = [0];
  countTracker1.innerHTML = 0;

  // Reset GeoJSON
  myJson = {
    type: "FeatureCollection",
    features: [],
  };
  console.log(dataArr);
}

// Geolocation
getGeolocation();

resetDataBtn.addEventListener("click", resetData);
exportCSVBtn.addEventListener("click", exportCSV2);
exportGeoJsonBtn.addEventListener("click", exportJson2);

addButton.addEventListener("click", countPress);
