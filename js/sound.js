//----------SOUND DETECTION AND VISUALISATION----------//

const constraints = {
  audio: true,
  video: false,
};

// Variables to control data capture and storage
let recordData = false;
let objectId = 0;

let objectDetector;
let status;
let objects = [];
let video;
let canvas, ctx;
const width = 480;
const height = 360;

let placer;

let audioCtx;

let source;
let stream;

// Set up the different audio nodes we will use for the app
let analyser;

// Set up canvas context for visualizer
canvas = document.querySelector(".visualizer");
const canvasCtx = canvas.getContext("2d");

let tapped = false; // check a tap has happened...
document.body.addEventListener("click", make);

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

  // Main block for doing the audio recording
  if (navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        visualize();
      })
      .catch(function (err) {
        console.log("The following getUserMedia error occured: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
}

function visualize() {
  console.log("v i s u a l i s e");

  WIDTH = 256; //canvas.width;
  HEIGHT = 256; //canvas.height;

  analyser.fftSize = 256;
  const bufferLengthAlt = analyser.frequencyBinCount;
  console.log(bufferLengthAlt);

  const dataArrayAlt = new Uint8Array(bufferLengthAlt);

  const drawAlt = function () {
    let inc = 1;

    let pixels = canvasCtx.getImageData(1, 0, WIDTH - inc, HEIGHT);
    canvasCtx.putImageData(pixels, 0, 0);

    drawVisual = requestAnimationFrame(drawAlt);

    analyser.getByteFrequencyData(dataArrayAlt);

    if (recordData) {
      tempAudioData = tempAudioData.map(function (val, indx) {
        return val + dataArrayAlt[indx];
      });
      tempAudioCount++; //increment tracker
    }

    let barWidth = 0; // (WIDTH / bufferLengthAlt) * 2.5;
    let barHeight = HEIGHT / bufferLengthAlt; // * 2.5;
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
      canvasCtx.fillRect(
        WIDTH - inc,
        y, //HEIGHT - barHeight / 2,
        inc, //WIDTH,
        barHeight //barHeight / 2
      );

      //x += barWidth -1;
      y += barHeight; //-1;
    }
  };

  drawAlt();
}

// array to store data and then average before saving to file
let tempAudioData = new Array(128);
let tempAudioCount = 0;

//add a timer for averaging data
let recordTimer; // = setInterval(timerAverageData,1000);
let mapTimer; //for re-bounding the map

function timerAverageData() {
  console.log("timer hit");
  geoJsonLayer.clearLayers();
  geoJsonLayer.addData(myJson);
  // average data
  tempAudioData = tempAudioData.map(function (val, indx) {
    return Math.round((val = val / tempAudioCount));
  });
  tempAudioCount = 0;
  realtimeAddArray(tempAudioData); // works
  console.log("tac averaged", tempAudioData);

  // increment timer display
  elapsedRecordingTime++;
  let mins = Math.floor(elapsedRecordingTime / 60);
  let secs = elapsedRecordingTime % 60;
  if (mins >= 1) {
    countTracker1.innerHTML = mins + "m" + secs + "s";
  } else {
    countTracker1.innerHTML = secs + "s";
  }
}

function timerMap() {
  console.log("T I M E R M A P");
  mapJson();
}

//----------MAP INITIALIZATION----------//

// Initialize a Leaflet map instance
var map = leafletMap();

// Initialize an empty GeoJSON layer for displaying data points on the map
var geoJsonLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: "#C97CF7",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    });
  },
}).addTo(map);

map.on("load", function () {
  map.addSource("points", {
    type: "geojson",
    data: myJson,
  });

  for (let i = 0; i < 128; i++) {
    map.addLayer({
      id: "sound-app-" + i,
      type: "circle",
      source: "points",
      paint: {
        "circle-radius": [
          "^",
          ["/", ["number", ["at", i, ["get", "audio"]]], 80],
          4,
        ],
        "circle-opacity": 0.4,
        "circle-color": [
          "interpolate",
          ["linear"],
          i,
          0,
          "#000",
          8,
          "#3300FF",
          16,
          "#FF0033",
          32,
          "#FFFF33",
          64,
          "#33FF33",
          128,
          "#33FFFF",
        ],
      },
    });
  }
});

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
  if (altitude === null) {
    myJson.features.push({
      type: "Feature",
      properties: {
        id: id,
        button_id: button_id,
        button_label: button_label,
        count: count,
        audio: the_text,
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
    myJson.features.push({
      type: "Feature",
      properties: {
        id: id,
        button_id: button_id,
        button_label: button_label,
        count: count,
        audio: the_text,
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
  console.log(myJson);
}

function createSmallJson(
  id,
  the_text,
  latitude,
  longitude,
  altitude,
  timestamp,
  iso_date,
  date,
  time
) {
  if (altitude === null) {
    myJson.features.push({
      type: "Feature",
      properties: {
        id: id,
        audio: the_text,
        timestamp: timestamp,
        "iso-date": iso_date,
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
    myJson.features.push({
      type: "Feature",
      properties: {
        id: id,
        audio: the_text,
        timestamp: timestamp,
        "iso-date": iso_date,
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
  console.log(myJson);
}

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
      //mapMe();
    }
  } else {
    addButton.innerHTML = "Start";
    addButton.classList.toggle("recording");
    clearInterval(recordTimer);
    recordTimer = null; //setInterval(timerAverageData,1000);
    clearInterval(mapTimer);
    mapTimer = null;
    // clean up and record any leftover data
    console.log("stop hit");
    // average data
    tempAudioData = tempAudioData.map(function (val, indx) {
      return Math.round((val = val / tempAudioCount));
    });
    tempAudioCount = 0;
    console.log("tac averaged stopped", tempAudioData);
  }
}

function realtimeAddArray(audioArr) {
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

  id++;

  var v = 0;

  var currArr = [
    id,
    Number(this.value),
    this.innerHTML,
    v,
    '"' + audioArr + '"',
    currPosition.coords.latitude,
    currPosition.coords.longitude,
    currPosition.coords.altitude,
    currPosition.coords.timestamp,
    yr + "-" + mo + "-" + dt + "T" + hr + ":" + mn + ":" + sc,
    yr + "-" + mo + "-" + dt,
    hr + ":" + mn + ":" + sc,
  ];
  dataArr.push(currArr);

  createSmallJson(
    id,
    audioArr,
    currPosition.coords.latitude,
    currPosition.coords.longitude,
    currPosition.coords.altitude,
    currPosition.coords.timestamp,
    yr + "-" + mo + "-" + dt + "T" + hr + ":" + mn + ":" + sc,
    yr + "-" + mo + "-" + dt,
    hr + ":" + mn + ":" + sc
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
