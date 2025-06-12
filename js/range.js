// Initialize a Leaflet map
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
      radius: Math.abs(feature.properties.range_value) + 1, // Circle radius
      fillColor: getColorByRangeValue(feature.properties.range_value), // Color based on range_value
      color: "#fff", // Border color
      weight: 2, // Border width
      opacity: 1, // Border opacity
      fillOpacity: 0.8, // Fill opacity
    });
  },
}).addTo(map);

// Helper function to determine circle color based on range_value
function getColorByRangeValue(range_value) {
  return range_value < 0 ? "#FFED6F" : "#C97CF7";
}

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
  range_value,
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

function mapJson() {
  // Clear existing data in the geoJsonLayer
  geoJsonLayer.clearLayers();

  // Add new data from myJson to the map
  geoJsonLayer.addData(myJson);

  // Adjust map view to fit the new data
  if (myJson.features.length > 0) {
    var bounds = geoJsonLayer.getBounds();
    map.fitBounds(bounds);
  }

  console.log("Map updated with new data.");
}

// variables for geo, time, buttons, data
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

// variables for editing
var currEdit = false;
var editBtn = document.getElementById("edit");

// array to store counts
var countArr = [0];

// storing button id values
addButton1.value = 0;

var buttonArr = [addButton1];
var countTrackerArr = [countTracker1];
//var inputFieldArr = [inputField1];
var rangeInputArr = [rangeInput1];

function countPress() {
  currDate = new Date();
  let yr = currDate.getFullYear();
  let mo = currDate.getMonth() + 1;
  let dt = currDate.getDate();
  let hr = currDate.getHours();
  let mn = currDate.getMinutes();
  let sc = currDate.getSeconds();
  //
  if (mo < 10) {
    mo = "0" + mo;
  }
  if (dt < 10) {
    dt = "0" + dt;
  }
  if (mn < 10) {
    mn = "0" + mn;
  }
  if (sc < 10) {
    sc = "0" + sc;
  }
  //
  id++;
  //this.value++;
  //countTrack1.innerHTML = this.value;
  countArr[this.value]++;
  var v = countArr[this.value];
  //var t = inputFieldArr[this.value].value;
  var r = rangeInputArr[this.value].value;
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
  //
  console.log(dataArr);
  //
  countTrackerArr[this.value].innerHTML = v;
  //inputFieldArr[this.value].value = ""
  //
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

function resetData() {
  //
  id = 0;
  dataArr = [dataHead];
  countArr = [0, 0, 0];
  countTracker1.innerHTML = 0;
  //countTracker2.innerHTML = 0;
  //countTracker3.innerHTML = 0;
  //
  // reset json
  myJson = {
    type: "FeatureCollection",
    features: [],
  };
  //
  console.log(dataArr);
}

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

    rangeInput1.min = rangeMin1.value;
    rangeInput1.max = rangeMax1.value;

    addButton1.classList.toggle("inactive-button");
  }
}

function updateRangeValue(v) {
  rangeTracker1.innerHTML = "current value = " + v;
}

// Geolocation
getGeolocation();

resetDataBtn.addEventListener("click", resetData);
exportCSVBtn.addEventListener("click", exportCSV2);
exportGeoJsonBtn.addEventListener("click", exportJson2);

addButton1.addEventListener("click", countPress);

editBtn.addEventListener("click", editPress);
