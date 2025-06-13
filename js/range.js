//----------MAP INITIALIZATION----------//

// Initialize a Leaflet map instance
var map = leafletMap();

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
  id++;
  countArr[this.value]++;
  var v = countArr[this.value];
  var r = rangeInputArr[this.value].value; // Get range value

  const { fullDate, date, time } = formatCurrentDateTime();

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
    fullDate,
    date,
    time,
  ];
  dataArr.push(currArr);

  console.log(dataArr);

  countTrackerArr[this.value].innerHTML = v;
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
      range_value: Number(r),
    }
  );
  mapJson();
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

addButton1.addEventListener("click", countPress);

editBtn.addEventListener("click", editPress);
