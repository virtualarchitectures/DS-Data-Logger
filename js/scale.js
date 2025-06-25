//----------MAP INITIALIZATION----------//

// Initialize a Leaflet map instance
var map = leafletMap();

// Initialize an empty GeoJSON layer for displaying data points on the map
var geoJsonLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: getColorByScaleValue(feature.properties.scale_value),
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    });
  },
}).addTo(map);

//----------UTILITY FUNCTIONS----------//

// Colorbrewer scale: https://colorbrewer2.org/#type=diverging&scheme=Spectral&n=11
function getColorByScaleValue(scale_value) {
  const colors = {
    1: "#9e0142",
    2: "#d53e4f",
    3: "#f46d43",
    4: "#fdae61",
    5: "#fee08b",
    6: "#ffffbf",
    7: "#e6f598",
    8: "#abdda4",
    9: "#66c2a5",
    10: "#3288bd",
    11: "#5e4fa2",
  };
  return colors[scale_value] || "#878787"; // Default to grey if out of range
}

//----------GEOJSON DATA MANAGEMENT----------//

var myJson = {
  type: "FeatureCollection",
  features: [],
};

//----------VARIABLE INITIALIZATION----------//

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
  "scale_value",
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
var countTracker = document.getElementById("countNumberTracker");
countTracker.innerHTML = 0;

var likertScale = document.getElementById("likertScale");
var likertScaleTracker = document.getElementById("likertScaleTracker");
var likertInputs = likertScale.querySelectorAll('input[name="likert"]');

// Update Likert scale selection display
likertInputs.forEach(input => {
  input.addEventListener("change", function() {
    likertScaleTracker.innerHTML = "Current selection: " + this.value;
  });
});

var currEdit = false;
var editBtn = document.getElementById("edit");

var countArr = [0];

addButton.value = 0;

var buttonArr = [addButton];
var countTrackerArr = [countTracker];
var scaleInputArr = [likertInputs];

//----------BUTTON INTERACTION LOGIC----------//

function countPress() {
  id++;
  countArr[this.value]++;
  var v = countArr[this.value];
  var selectedValue = document.querySelector('input[name="likert"]:checked').value;

  const { fullDate, date, time } = formatCurrentDateTime();

  var currArr = [
    id,
    Number(this.value),
    "Likert Scale",
    v,
    Number(selectedValue),
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
      count: v,
      scale_value: Number(selectedValue),
    }
  );
  mapJson();
}

// Function to edit Likert scale options
function editPress() {
  currEdit = !currEdit;
  if (currEdit) {
    editBtn.innerHTML = "Save";
    showLikertEditOptions();
  } else {
    editBtn.innerHTML = "Edit";
    finalizeLikertEdit();
  }
}

// Function to show Likert scale edit options
function showLikertEditOptions() {
  // Code to make inputs for editing Likert scale options visible
}

// Function to finalize Likert scale edit changes
function finalizeLikertEdit() {
  // Code to save changes to the Likert scale options
}

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
editBtn.addEventListener("click", editPress);

getGeolocation();