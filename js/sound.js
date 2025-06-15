//----------SOUND DETECTION AND VISUALISATION----------//

// Set constraints for audio capture (audio only, no video)
const constraints = {
  audio: true,
  video: false,
};

// Variables to control data capture and storage
let recordData = false; // flag to indicate whether data should be recorded
let objectId = 0; // id for managing objects

// Variables for object detector and visualization
let objectDetector;
let status;
let objects = [];
let video;
let canvas, ctx; // variables for canvas context
const width = 480; // width for video or canvas
const height = 360; // height for video or canvas

let placer;

// Initialize audio context
let audioCtx;

// Declare variables for managing media stream
let source;
let stream;

// Set up audio nodes for sound analysis
let analyser;

// Set up canvas context for visualizer
canvas = document.querySelector(".visualizer");
const canvasCtx = canvas.getContext("2d");

// Flag to check if a user interaction has occurred
let tapped = false;
document.body.addEventListener("click", make);

// Function to initialize audio context and start media stream on user interaction
async function make() {
  console.log("func make");
  tapped = true;
  document.body.removeEventListener("click", make);

  var s = document.getElementById("shield");
  s.style.visibility = "hidden";

  placer = document.getElementById("audio");

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;

  // Request access to user's microphone
  if (navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        visualize(); // Call visualize to render the audio data
      })
      .catch(function (err) {
        console.log("The following getUserMedia error occurred: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
}

// Function to visualize audio frequency data on canvas
function visualize() {
  console.log("v i s u a l i s e");

  WIDTH = 256; // Set dimension for visualizer
  HEIGHT = 256;

  analyser.fftSize = 256;
  const bufferLengthAlt = analyser.frequencyBinCount;
  console.log(bufferLengthAlt);

  const dataArrayAlt = new Uint8Array(bufferLengthAlt);

  const drawAlt = function () {
    let inc = 1; // Increment for drawing

    let pixels = canvasCtx.getImageData(1, 0, WIDTH - inc, HEIGHT);
    canvasCtx.putImageData(pixels, 0, 0);

    drawVisual = requestAnimationFrame(drawAlt);

    analyser.getByteFrequencyData(dataArrayAlt);

    if (recordData) {
      tempAudioData = tempAudioData.map(function (val, indx) {
        return val + dataArrayAlt[indx];
      });
      tempAudioCount++;
    }

    let barWidth = 0;
    let barHeight = HEIGHT / bufferLengthAlt;
    let x = WIDTH;
    let y = 0;

    for (let i = 0; i < bufferLengthAlt; i++) {
      barWidth = dataArrayAlt[i];

      if (recordData) {
        canvasCtx.fillStyle =
          "rgb(" +
          (201 / 255) * (barWidth * 2) +
          "," +
          (124 / 255) * (barWidth * 2) +
          "," +
          (247 / 255) * (barWidth * 2) +
          ")";
      } else {
        canvasCtx.fillStyle =
          "rgb(" + barWidth * 2 + "," + barWidth * 2 + "," + barWidth * 2 + ")";
      }
      canvasCtx.fillRect(WIDTH - inc, y, inc, barHeight);

      y += barHeight;
    }
  };

  drawAlt();
}

// Array and counter for averaging audio data before saving
let tempAudioData = new Array(128);
let tempAudioCount = 0;

// Timers for data averaging and map updates
let recordTimer;
let mapTimer;

// Function to handle timer ticks for averaging data
function timerAverageData() {
  console.log("timer hit");
  geoJsonLayer.clearLayers();
  geoJsonLayer.addData(myJson);
  tempAudioData = tempAudioData.map(function (val, indx) {
    return Math.round((val = val / tempAudioCount));
  });
  tempAudioCount = 0;
  realtimeAdd(tempAudioData);
  console.log("tac averaged", tempAudioData);

  elapsedRecordingTime++;
  let mins = Math.floor(elapsedRecordingTime / 60);
  let secs = elapsedRecordingTime % 60;
  if (mins >= 1) {
    countTracker1.innerHTML = mins + "m" + secs + "s";
  } else {
    countTracker1.innerHTML = secs + "s";
  }
}

// Timer function to update map
function timerMap() {
  console.log("T I M E R M A P");
  mapJson();
}

//----------MAP INITIALIZATION----------//

// Initialize a Leaflet map instance
var map = leafletMap();

// Create an empty GeoJSON layer for map display
var geoJsonLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    // Get the audio data array from feature properties
    const audioData = feature.properties.audio;

    // Create a group of circle markers for each frequency band
    const markerGroup = L.featureGroup();

    audioData.forEach((value, index) => {
      L.circleMarker(latlng, {
        radius: getRadiusByAudioValue(value),
        fillColor: getColorByFrequencyIndex(index),
        color: "#fff",
        weight: 1,
        opacity: 0.4,
        fillOpacity: 0.4,
      }).addTo(markerGroup);
    });

    return markerGroup;
  },
}).addTo(map);

//----------UTILITY FUNCTIONS----------//

// Override the default showMap function to require user tap before starting microphone
function showMap(position) {
  geoEnabled.innerHTML = "geolocation enabled";
  geoEnabled.style.visibility = "hidden";
  currPosition = position;
  if (tapped) {
    var s = document.getElementById("shield");
    s.style.visibility = "hidden";
  }
}

// Function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Function to determine circle color based on frequency index
function getColorByFrequencyIndex(index) {
  // Define color stops
  const colorStops = [
    { pos: 0, color: "#000000" }, // Black
    { pos: 8, color: "#3300FF" }, // Blue
    { pos: 16, color: "#FF0033" }, // Red
    { pos: 32, color: "#FFFF33" }, // Yellow
    { pos: 64, color: "#33FF33" }, // Green
    { pos: 128, color: "#33FFFF" }, // Cyan
  ];

  // Find the appropriate color segment
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (index >= colorStops[i].pos && index < colorStops[i + 1].pos) {
      const factor =
        (index - colorStops[i].pos) /
        (colorStops[i + 1].pos - colorStops[i].pos);
      return interpolateColor(
        colorStops[i].color,
        colorStops[i + 1].color,
        factor
      );
    }
  }

  return colorStops[colorStops.length - 1].color;
}

// Function to calculate circle radius based on audio intensity
function getRadiusByAudioValue(audioValue) {
  return Math.pow(audioValue / 80, 4) + 8; // Base radius of 4, scaled by audio intensity
}

//----------GEOJSON DATA MANAGEMENT----------//

// Initialize GeoJSON object to store detected audio data
var myJson = {
  type: "FeatureCollection",
  features: [],
};

//----------DATA CAPTURE AND RECORDING----------//

// Handle count button press to start/stop recording
function countPress() {
  recordData = !recordData;

  if (recordData) {
    addButton.innerHTML = "Stop";
    addButton.classList.toggle("recording");
    tempAudioData = tempAudioData.fill(0);
    recordTimer = setInterval(timerAverageData, 1000);
    mapTimer = setInterval(timerMap, 60000);

    if (myJson.features.length > 0) {
      mapJson();
    } else {
      console.log("map me");
    }
  } else {
    addButton.innerHTML = "Start";
    addButton.classList.toggle("recording");
    clearInterval(recordTimer);
    recordTimer = null;
    clearInterval(mapTimer);
    mapTimer = null;
    tempAudioData = tempAudioData.map(function (val, indx) {
      return Math.round((val = val / tempAudioCount));
    });
    tempAudioCount = 0;
    console.log("tac averaged stopped", tempAudioData);
  }
}

// Add detected audio data in real-time
function realtimeAdd(audioArr) {
  const dateTime = formatCurrentDateTime();

  id++;

  const currArr = [
    id,
    Number(this.value),
    this.innerHTML,
    0,
    '"' + audioArr + '"',
    currPosition.coords.latitude,
    currPosition.coords.longitude,
    currPosition.coords.altitude,
    currPosition.coords.timestamp,
    dateTime.isoDateTime,
    dateTime.date,
    dateTime.time,
  ];

  dataArr.push(currArr);

  createJson(
    id,
    currPosition.coords.latitude,
    currPosition.coords.longitude,
    currPosition.coords.altitude,
    currPosition.coords.timestamp,
    dateTime.isoDateTime,
    dateTime.date,
    dateTime.time,
    { audio: audioArr }
  );
}

//----------VARIABLE INITIALIZATION----------//

// Variables for geolocation, time, buttons, and data initialization
var geoEnabled = document.getElementById("geo-enabled");

var currPosition;

var currDate = new Date();

var elapsedRecordingTime = 0;

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
  "audio",
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
countTracker1.innerHTML = "0s";

var inputField1 = document.getElementById("inputField1");

// array to store counts
var countArr = [0];

// storing button id values
addButton.value = 0;

var buttonArr = [addButton];
var countTrackerArr = [countTracker1];
var inputFieldArr = [inputField1];

//----------GEOLOCATION AND EVENT LISTENERS----------//

// Geolocation initialization
getGeolocation();

// Event listeners for data management buttons
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
});
exportCSVBtn.addEventListener("click", exportCSV);
exportGeoJsonBtn.addEventListener("click", exportJson);

addButton.addEventListener("click", countPress);
