//----------MAP INITIALIZATION----------//

// Initialize a Leaflet map instance
var map = leafletMap();

// Initialize an empty GeoJSON layer for displaying data points on the map
var geoJsonLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: getColorByButtonId(feature.properties.button_id),
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    });
  },
}).addTo(map);

//----------OBJECT DETECTION AND TRACKING----------//

// Set camera constraints for video capture
const constraints = {
  audio: false,
  video: {
    facingMode: {
      ideal: "environment",
    },
  },
};

// Variables to control data capture and storage
let snapData = false;
let recordData = false;
let objectId = 0;

// Variables for object detector and video capture
let objectDetector;
let status;
let objects = [];
let video;
let canvas, ctx;
const width = 480;
const height = 360;

// HTML element for video placement
let placer;

// Initialize video and object detection model
async function make() {
  placer = document.getElementById("vid");
  video = await getVideo();
  objectDetector = await ml5.objectDetector("cocossd", startDetecting);
  canvas = createCanvas(width, height);
  ctx = canvas.getContext("2d");
}

// Event listener for DOM content loading
window.addEventListener("DOMContentLoaded", function () {
  make();
});

// Callback function for processing each detected object
function loopObjects(item, index, arr) {
  if (index < arr.length - 1) {
    inputFieldArr[0].value += item.label + ", ";
  } else {
    inputFieldArr[0].value += item.label;
  }
}

// Start object detection
function startDetecting() {
  detect();
}

// Perform detection and draw results
function detect() {
  objectDetector.detect(video, function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    objects = results;

    if (objects) {
      draw();
      if (recordData || snapData) {
        // Add objects to textfield
        if (objects.length > 0) {
          inputFieldArr[0].value += "\n";
          objects.forEach(loopObjects);
          inputFieldArr[0].scrollTop = inputFieldArr[0].scrollHeight;
          realtimeAdd(objects);
        }
        snapData = false;
      }
    }

    detect();
  });
}

function draw() {
  // Clear part of the canvas
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(video, 0, 0);
  for (let i = 0; i < objects.length; i += 1) {
    ctx.font = "16px Arial";
    if (recordData) {
      ctx.fillStyle = "#C97CF7";
    } else {
      ctx.fillStyle = "#27baa4";
    }
    ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y + 16);

    ctx.beginPath();
    ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
    if (recordData) {
      ctx.strokeStyle = "#C97CF7";
    } else {
      ctx.strokeStyle = "#27baa4";
    }
    ctx.stroke();
    ctx.closePath();
  }
}

//----------UTILITY FUNCTIONS----------//

// Get video stream from the user's camera
async function getVideo() {
  const videoElement = document.createElement("video");
  videoElement.width = 10;
  videoElement.height = 10;
  let hiddenVideo = document.querySelector("#hiddenvid");
  hiddenVideo.appendChild(videoElement);

  const capture = await navigator.mediaDevices.getUserMedia(constraints);
  videoElement.srcObject = capture;
  videoElement.play();

  videoElement.setAttribute("playsinline", true);
  videoElement.setAttribute("autoplay", true);
  videoElement.setAttribute("muted", true);

  return videoElement;
}

// Create a canvas element
function createCanvas(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  placer.appendChild(canvas);
  return canvas;
}

// Map event listener for loading and setting source
map.on("load", function () {
  map.addSource("points", {
    type: "geojson",
    data: myJson,
  });

  // Add a symbol layer to the map
  map.addLayer({
    id: "points",
    type: "symbol",
    source: "points",
    layout: {
      "text-field": ["get", "label"],
      "text-size": 10,
      "text-allow-overlap": true,
    },
    paint: {
      "text-halo-color": "#C97CF7",
      "text-halo-width": 0.5,
      "text-halo-blur": 0.5,
    },
  });
});

//----------GEOJSON DATA MANAGEMENT----------//

// Initialize GeoJSON object to store detected object data
var myJson = {
  type: "FeatureCollection",
  features: [],
};

// Initialize a smaller GeoJSON data structure
var dotJson = {
  type: "FeatureCollection",
  features: [],
};

// Create a GeoJSON feature and add it to the data object
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
  //console.log("blah blah json");
  if (altitude === null) {
    myJson.features.push({
      type: "Feature",
      properties: {
        id: id,
        button_id: button_id,
        button_label: button_label,
        count: count,
        objects: the_text,
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
        objects: the_text,
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

// Create a smaller GeoJSON feature with limited properties
function createSmallJson(
  id,
  the_label,
  the_confidence,
  latitude,
  longitude,
  altitude,
  timestamp,
  iso_date,
  date,
  time
) {
  //console.log("blah blah json");
  if (altitude === null) {
    myJson.features.push({
      geometry: {
        type: "Point",
        coordinates: [
          currPosition.coords.longitude,
          currPosition.coords.latitude,
        ],
      },
      type: "Feature",
      properties: {
        id: id,
        label: the_label,
        confidence: the_confidence,
        timestamp: timestamp,
        "iso-date": iso_date,
        date: date,
        time: time,
      },
    });
  } else {
    myJson.features.push({
      geometry: {
        type: "Point",
        coordinates: [
          currPosition.coords.longitude,
          currPosition.coords.latitude,
          currPosition.coords.altitude,
        ],
      },
      type: "Feature",
      properties: {
        id: id,
        label: the_label,
        confidence: the_confidence,
        timestamp: timestamp,
        "iso-date": iso_date,
        date: date,
        time: time,
      },
    });
  }
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
var exportMapBtn = document.getElementById("exportMap");

var id = 0;
var dataHead = [
  "id",
  "button_id",
  "label",
  "count",
  "objects",
  "latitude",
  "longitude",
  "altitude",
  "timestamp",
  "iso-date",
  "date",
  "time",
];
var dataArr = [dataHead];

let recordTimer; // for displaying elapsed time
let elapsedRecordingTime = 0;
let mapTimer; // for re-bounding the map
let snapTimer; // to trigger map update after pressing the button

var addButton = document.getElementById("adder");
var snapButton = document.getElementById("adder2");

var countTracker1 = document.getElementById("countNumberTracker1");
countTracker1.innerHTML = "0s";

var inputField1 = document.getElementById("inputField1");

// Array to store counts
var countArr = [0];

// Storing button id values
addButton.value = 0;

var buttonArr = [addButton];
var countTrackerArr = [countTracker1];
var inputFieldArr = [inputField1];

//----------TIMER AND MAP UPDATE FUNCTIONS----------//

// Handle timer events for map and data updating
function timerAverageData() {
  console.log("timer hit");
  console.log(myJson);
  map.getSource("points").setData(myJson);

  // Increment timer display
  elapsedRecordingTime++;
  let mins = Math.floor(elapsedRecordingTime / 60);
  let secs = elapsedRecordingTime % 60;
  if (mins >= 1) {
    countTracker1.innerHTML = mins + "m" + secs + "s";
  } else {
    countTracker1.innerHTML = secs + "s";
  }
}

// Timer callback for map updates
function timerMap() {
  console.log("T I M E R M A P");
  mapJson();
}

// Timer callback for map updates after snap
function timerSnap() {
  console.log("T I M E R S N A P");
  map.getSource("points").setData(myJson);
  clearInterval(snapTimer);
  snapTimer = null;
}

// Handle snap button press for capturing data
function snapPress() {
  snapData = true;
  if (myJson.features.length > 0) {
    mapJson();
  } else {
    console.log("map me");
    //mapMe();
  }
  snapTimer = setInterval(timerSnap, 100);
}

// Handle count button press to start/stop recording
function countPress() {
  recordData = !recordData;

  if (recordData) {
    addButton.innerHTML = "Stop";
    addButton.classList.toggle("recording");
    recordTimer = setInterval(timerAverageData, 1000);
    mapTimer = setInterval(timerMap, 60000);

    if (myJson.features.length > 0) {
      mapJson();
    } else {
      console.log("map me");
      //mapMe();
    }
  } else {
    addButton.innerHTML = "Start";
    addButton.classList.toggle("recording");
    clearInterval(recordTimer);
    recordTimer = null; //setInterval(timerAverageData,1000);
    clearInterval(mapTimer);
    mapTimer = null;
  }
}

// Add detected object data in real-time
function realtimeAdd(objectArr) {
  const { fullDate, date, time } = formatCurrentDateTime();
  var v = 0;

  // new method just make an array of the labels, don't try to make a json array for CSV
  for (let i = 0; i < objectArr.length; i++) {
    let currArr = [
      id + i,
      Number(this.value),
      this.innerHTML,
      v,
      objectArr[i].label,
      currPosition.coords.latitude,
      currPosition.coords.longitude,
      currPosition.coords.altitude,
      currPosition.coords.timestamp,
      fullDate,
      date,
      time,
    ];
    dataArr.push(currArr);
  }

  // use  only parts of json object and rewrap as json
  for (let i = 0; i < objectArr.length; i++) {
    createSmallJson(
      id,
      objectArr[i].label,
      parseFloat(objectArr[i].confidence.toFixed(3)),
      currPosition.coords.latitude,
      currPosition.coords.longitude,
      currPosition.coords.altitude,
      currPosition.coords.timestamp,
      fullDate,
      date,
      time
    );
    id++;
  }
}

//----------MAP EXPORT----------//

// Map export function to export the map as an image
function exportMap() {
  map.getCanvas().toBlob(mapBlobHandler);
}

// Blob handler for exported map data
function mapBlobHandler(content) {
  var blobUrl = URL.createObjectURL(content);
  //
  let link = document.createElement("a"); // Or maybe get it from the current document
  link.href = blobUrl;
  link.download = "datawalking-map.png";
  link.innerText = "Click here to download the file";
  link.id = "download";
  link.click();
}

// Reset function for object-specific data
function resetObjectSpecificData() {
  elapsedRecordingTime = 0;
  inputFieldArr[0].value = "Objects recorded...";
}

//----------GEOLOCATION AND EVENT LISTENERS----------//

// Geolocation initialization
getGeolocation();

resetDataBtn.addEventListener("click", () => {
  resetData(
    dataArr,
    dataHead,
    countArr,
    countTrackerArr,
    myJson,
    map,
    geoJsonLayer
  );
  resetObjectSpecificData();
});
exportCSVBtn.addEventListener("click", exportCSV);
exportGeoJsonBtn.addEventListener("click", exportJson);

exportMapBtn.addEventListener("click", exportMap);

addButton.addEventListener("click", countPress);
snapButton.addEventListener("click", snapPress);
