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
      radius: 8, // Circle radius
      fillColor: getColorByButtonId(feature.properties.button_id), // Color based on button_id
      color: "#fff", // Border color
      weight: 2, // Border width
      opacity: 1, // Border opacity
      fillOpacity: 0.8, // Fill opacity
    });
  },
}).addTo(map);

// Helper function to determine circle color based on button_id
function getColorByButtonId(button_id) {
  const colors = {
    0: "#c97cf7",
    1: "#ffffb3",
    2: "#fb8072",
    3: "#80b1d3",
    4: "#fdb462",
    5: "#fccde5",
    6: "#bebada",
    7: "#ffed6f",
    8: "#ccebc5",
  };
  return colors[button_id] || "#ccc"; // Default color if button_id is not mapped
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
  latitude,
  longitude,
  altitude,
  timestamp,
  iso_date,
  date,
  time
) {
  console.log("blah blah json");
  //
  if (altitude === null) {
    myJson.features.push({
      type: "Feature",
      properties: {
        id: id,
        button_id: button_id,
        button_label: button_label,
        count: count,
        timestamp: timestamp,
        "iso-date": iso_date,
        date: date,
        time: time,
      },
      geometry: {
        type: "Point",
        coordinates: [
          currPosition.coords.longitude,
          currPosition.coords.latitude,
        ],
      },
    });
  } else {
    //
    myJson.features.push({
      type: "Feature",
      properties: {
        id: id,
        button_id: button_id,
        button_label: button_label,
        count: count,
        timestamp: timestamp,
        "iso-date": iso_date,
        date: date,
        time: time,
      },
      geometry: {
        type: "Point",
        coordinates: [
          currPosition.coords.longitude,
          currPosition.coords.latitude,
          currPosition.coords.altitude,
        ],
      },
    });
  }
  //
  console.log(myJson);
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
  "latitude",
  "longitude",
  "altitude",
  "timestamp",
  "iso-date",
  "date",
  "time",
];
var dataArr = [dataHead];

var countBtn1 = document.getElementById("count1");
var countBtn2 = document.getElementById("count2");
var countBtn3 = document.getElementById("count3");
var countBtn4 = document.getElementById("count4");
var countBtn5 = document.getElementById("count5");
var countBtn6 = document.getElementById("count6");
var countBtn7 = document.getElementById("count7");
var countBtn8 = document.getElementById("count8");
var countBtn9 = document.getElementById("count9");

var countTracker1 = document.getElementById("countNumberTracker1");
countTracker1.innerHTML = 0;
var countTracker2 = document.getElementById("countNumberTracker2");
countTracker2.innerHTML = 0;
var countTracker3 = document.getElementById("countNumberTracker3");
countTracker3.innerHTML = 0;
var countTracker4 = document.getElementById("countNumberTracker4");
countTracker4.innerHTML = 0;
var countTracker5 = document.getElementById("countNumberTracker5");
countTracker5.innerHTML = 0;
var countTracker6 = document.getElementById("countNumberTracker6");
countTracker6.innerHTML = 0;
var countTracker7 = document.getElementById("countNumberTracker7");
countTracker7.innerHTML = 0;
var countTracker8 = document.getElementById("countNumberTracker8");
countTracker8.innerHTML = 0;
var countTracker9 = document.getElementById("countNumberTracker9");
countTracker9.innerHTML = 0;

// variables for editing
var currEdit = false;
var editBtn = document.getElementById("edit");

var buttonLabel1 = document.getElementById("buttonLabel1");
buttonLabel1.value = countBtn1.innerHTML;
buttonLabel1.style.visibility = "hidden";

var buttonLabel2 = document.getElementById("buttonLabel2");
buttonLabel2.value = countBtn2.innerHTML;
buttonLabel2.style.visibility = "hidden";

var buttonLabel3 = document.getElementById("buttonLabel3");
buttonLabel3.value = countBtn3.innerHTML;
buttonLabel3.style.visibility = "hidden";

var buttonLabel4 = document.getElementById("buttonLabel4");
buttonLabel4.value = countBtn4.innerHTML;
buttonLabel4.style.visibility = "hidden";

var buttonLabel5 = document.getElementById("buttonLabel5");
buttonLabel5.value = countBtn5.innerHTML;
buttonLabel5.style.visibility = "hidden";

var buttonLabel6 = document.getElementById("buttonLabel6");
buttonLabel6.value = countBtn6.innerHTML;
buttonLabel6.style.visibility = "hidden";

var buttonLabel7 = document.getElementById("buttonLabel7");
buttonLabel7.value = countBtn7.innerHTML;
buttonLabel7.style.visibility = "hidden";

var buttonLabel8 = document.getElementById("buttonLabel8");
buttonLabel8.value = countBtn8.innerHTML;
buttonLabel8.style.visibility = "hidden";

var buttonLabel9 = document.getElementById("buttonLabel9");
buttonLabel9.value = countBtn9.innerHTML;
buttonLabel9.style.visibility = "hidden";

// array to store counts
var countArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// storing button id values
countBtn1.value = 0;
countBtn2.value = 1;
countBtn3.value = 2;
countBtn4.value = 3;
countBtn5.value = 4;
countBtn6.value = 5;
countBtn7.value = 6;
countBtn8.value = 7;
countBtn9.value = 8;

var buttonArr = [
  countBtn1,
  countBtn2,
  countBtn3,
  countBtn4,
  countBtn5,
  countBtn6,
  countBtn7,
  countBtn8,
  countBtn9,
];
var countTrackerArr = [
  countTracker1,
  countTracker2,
  countTracker3,
  countTracker4,
  countTracker5,
  countTracker6,
  countTracker7,
  countTracker8,
  countTracker9,
];

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
  if (hr < 10) {
    hr = "0" + hr;
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

  var currArr = [
    id,
    Number(this.value),
    this.innerHTML,
    v,
    currPosition.coords.latitude,
    currPosition.coords.longitude,
    currPosition.coords.altitude,
    currPosition.coords.timestamp,
    yr + "-" + mo + "-" + dt + "T" + hr + ":" + mn + ":" + sc, //yr + "-" + mo + "-" + dt,
    yr + "-" + mo + "-" + dt,
    hr + ":" + mn + ":" + sc,
  ];
  dataArr.push(currArr);
  //
  console.log(dataArr);
  //
  countTrackerArr[this.value].innerHTML = v;
  //
  dataReadOut.innerHTML = currArr;

  createJson(
    id,
    Number(this.value),
    this.innerHTML,
    v,
    currPosition.coords.latitude,
    currPosition.coords.longitude,
    currPosition.coords.altitude,
    currPosition.coords.timestamp,
    yr + "-" + mo + "-" + dt + "T" + hr + ":" + mn + ":" + sc, //yr + "-" + mo + "-" + dt,
    yr + "-" + mo + "-" + dt,
    hr + ":" + mn + ":" + sc
  );
  mapJson();
}

function resetData() {
  //
  id = 0;
  dataArr = [dataHead];
  countArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  countTracker1.innerHTML = 0;
  countTracker2.innerHTML = 0;
  countTracker3.innerHTML = 0;
  countTracker4.innerHTML = 0;
  countTracker5.innerHTML = 0;
  countTracker6.innerHTML = 0;
  countTracker7.innerHTML = 0;
  countTracker8.innerHTML = 0;
  countTracker9.innerHTML = 0;
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
    buttonLabel2.style.visibility = "visible";
    buttonLabel3.style.visibility = "visible";
    buttonLabel4.style.visibility = "visible";
    buttonLabel5.style.visibility = "visible";
    buttonLabel6.style.visibility = "visible";
    buttonLabel7.style.visibility = "visible";
    buttonLabel8.style.visibility = "visible";
    buttonLabel9.style.visibility = "visible";

    countBtn1.classList.toggle("inactive-button");
    countBtn2.classList.toggle("inactive-button");
    countBtn3.classList.toggle("inactive-button");
    countBtn4.classList.toggle("inactive-button");
    countBtn5.classList.toggle("inactive-button");
    countBtn6.classList.toggle("inactive-button");
    countBtn7.classList.toggle("inactive-button");
    countBtn8.classList.toggle("inactive-button");
    countBtn9.classList.toggle("inactive-button");
  } else {
    editBtn.innerHTML = "Edit";

    buttonLabel1.style.visibility = "hidden";
    countBtn1.innerHTML = buttonLabel1.value;
    buttonLabel2.style.visibility = "hidden";
    countBtn2.innerHTML = buttonLabel2.value;
    buttonLabel3.style.visibility = "hidden";
    countBtn3.innerHTML = buttonLabel3.value;

    buttonLabel4.style.visibility = "hidden";
    countBtn4.innerHTML = buttonLabel4.value;
    buttonLabel5.style.visibility = "hidden";
    countBtn5.innerHTML = buttonLabel5.value;
    buttonLabel6.style.visibility = "hidden";
    countBtn6.innerHTML = buttonLabel6.value;

    buttonLabel7.style.visibility = "hidden";
    countBtn7.innerHTML = buttonLabel7.value;
    buttonLabel8.style.visibility = "hidden";
    countBtn8.innerHTML = buttonLabel8.value;
    buttonLabel9.style.visibility = "hidden";
    countBtn9.innerHTML = buttonLabel9.value;

    countBtn1.classList.toggle("inactive-button");
    countBtn2.classList.toggle("inactive-button");
    countBtn3.classList.toggle("inactive-button");
    countBtn4.classList.toggle("inactive-button");
    countBtn5.classList.toggle("inactive-button");
    countBtn6.classList.toggle("inactive-button");
    countBtn7.classList.toggle("inactive-button");
    countBtn8.classList.toggle("inactive-button");
    countBtn9.classList.toggle("inactive-button");
  }
}

// Geolocation
getGeolocation();

resetDataBtn.addEventListener("click", resetData);
exportCSVBtn.addEventListener("click", exportCSV2);
exportGeoJsonBtn.addEventListener("click", exportJson2);

countBtn1.addEventListener("click", countPress);
countBtn2.addEventListener("click", countPress);
countBtn3.addEventListener("click", countPress);
countBtn4.addEventListener("click", countPress);
countBtn5.addEventListener("click", countPress);
countBtn6.addEventListener("click", countPress);
countBtn7.addEventListener("click", countPress);
countBtn8.addEventListener("click", countPress);
countBtn9.addEventListener("click", countPress);

editBtn.addEventListener("click", editPress);
