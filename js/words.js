// Initialize Leaflet map
var map = L.map('map').setView([53.350140, -6.266155], 9);

// Add a tile layer (using OpenStreetMap as an example)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Initialize an empty GeoJSON layer
var geoJsonLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8, // Circle radius
      fillColor: '#C97CF7',
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.text); // Display the text from GeoJSON properties
  }
}).addTo(map);

// Initialize the GeoJSON data object
var myJson = {
  type: "FeatureCollection",
  features: []
};

function createJson(id, button_id, button_label, count, the_text, latitude, longitude, altitude, timestamp, iso_date, date, time) {
    console.log("blah blah json");
    if (altitude === null) {
        myJson.features.push({
            "type": "Feature",
            "properties": {
                "id": id,
                "button_id": button_id,
                "button_label": button_label,
                "count": count,
                "text": the_text,
                "timestamp": timestamp,
                "iso-date": iso_date,
                "date": date,
                "time": time
            },
            "geometry": {
                "type": "Point",
                "coordinates": [longitude, latitude]
            }
        });
    } else {
        myJson.features.push({
            "type": "Feature",
            "properties": {
                "id": id,
                "button_id": button_id,
                "button_label": button_label,
                "count": count,
                "text": the_text,
                "timestamp": timestamp,
                "iso-date": iso_date,
                "date": date,
                "time": time
            },
            "geometry": {
                "type": "Point",
                "coordinates": [longitude, latitude, altitude]
            }
        });
    }
    console.log(myJson);
}

function mapJson() {
  // Clear existing data in the geoJsonLayer
  geoJsonLayer.clearLayers();

  // Add new data
  geoJsonLayer.addData(myJson);

  // Adjust map view to fit the new data
  if (myJson.features.length > 0) {
    var bounds = geoJsonLayer.getBounds();
    map.fitBounds(bounds);
  }

  console.log("Map updated with new data.");
}

function exportJson() {
    console.log("export geojson...");
    console.log(myJson);

    // Convert object to Blob
    const blobData = new Blob([JSON.stringify(myJson, undefined, 2)], {
        type: "text/json;charset=utf-8",
    });

    // Convert Blob to URL
    const blobUrl = URL.createObjectURL(blobData);

    // Create an a element with blob URL
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.target = "_self";
    anchor.download = "datawalking.geojson";

    // Auto click on a element, trigger the file download
    anchor.click();

    // Don't forget ;)
    URL.revokeObjectURL(blobUrl);
}

function exportJson2() {
    console.log("export geojson new way 2...");
    console.log(myJson);

    let dateStr = getSaveDate(); // Format the date for filename

    // Convert object to Blob
    const blobData = new Blob([JSON.stringify(myJson, undefined, 2)], {
        type: "text/json;charset=utf-8",
    });

    var reader = new FileReader();
    reader.onload = function () {
        var popup = window.open();
        var link = document.createElement("a");
        link.setAttribute("href", reader.result);
        link.setAttribute("download", "datawalking-" + dateStr + ".geojson");
        popup.document.body.appendChild(link);
        link.click();
    };
    reader.readAsDataURL(blobData);
}

function getSaveDate() {
    let saveDate = new Date();
    let yr = currDate.getFullYear();
    let mo = currDate.getMonth() + 1;
    let dt = currDate.getDate();
    let hr = currDate.getHours();
    let mn = currDate.getMinutes();
    let sc = currDate.getSeconds();

    if (mo < 10) { mo = '0' + mo; }
    if (dt < 10) { dt = '0' + dt; }
    if (hr < 10) { hr = '0' + hr; }
    if (mn < 10) { mn = '0' + mn; }
    if (sc < 10) { sc = '0' + sc; }

    return yr + "-" + mo + "-" + dt + "-" + hr + "-" + mn + "-" + sc;
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
var dataHead = ["id", "button_id", "label", "count", "text", "latitude", "longitude", "altitude", "timestamp", "iso-date", "date", "time"];
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

// Trigger location
function getLocation() {
    console.log("trying to get geolocation enabled");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, failPosition);
        navigator.geolocation.watchPosition(trackPosition);
        console.log("geo location enabled");
    } else {
        console.log("geo location failed");
        geoEnabled.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function failPosition(error) {
    if (error.code == error.PERMISSION_DENIED) {
        console.log("geolocation access denied");
    } else {
        console.log("other error");
    }
}

function showPosition(position) {
    geoEnabled.innerHTML = "geolocation enabled";
    geoEnabled.style.visibility = "hidden";
    var s = document.getElementById("shield");
    s.style.visibility = "hidden";
}

function trackPosition(position) {
    currPosition = position;
}

function countPress() {
    currDate = new Date();
    let yr = currDate.getFullYear();
    let mo = currDate.getMonth() + 1;
    let dt = currDate.getDate();
    let hr = currDate.getHours();
    let mn = currDate.getMinutes();
    let sc = currDate.getSeconds();

    if (mo < 10) { mo = '0' + mo; }
    if (dt < 10) { dt = '0' + dt; }
    if (hr < 10) { hr = '0' + hr; }
    if (mn < 10) { mn = '0' + mn; }
    if (sc < 10) { sc = '0' + sc; }

    id++;
    countArr[this.value]++;
    var v = countArr[this.value];
    var t = inputFieldArr[this.value].value;

    var currArr = [id, Number(this.value), this.innerHTML, v, "\"" + t + "\"", currPosition.coords.latitude, currPosition.coords.longitude, currPosition.coords.altitude, currPosition.coords.timestamp, yr + "-" + mo + "-" + dt + "T" + hr + ":" + mn + ":" + sc, yr + "-" + mo + "-" + dt, hr + ":" + mn + ":" + sc];
    dataArr.push(currArr);

    console.log(dataArr);
    countTrackerArr[this.value].innerHTML = v;
    inputFieldArr[this.value].value = ""
    inputFieldArr[this.value].focus();
    dataReadOut.innerHTML = currArr;

    createJson(id, Number(this.value), this.innerHTML, v, t, currPosition.coords.latitude, currPosition.coords.longitude, currPosition.coords.altitude, currPosition.coords.timestamp, yr + "-" + mo + "-" + dt + "T" + hr + ":" + mn + ":" + sc, yr + "-" + mo + "-" + dt, hr + ":" + mn + ":" + sc);
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
        features: []
    };
    console.log(dataArr);
}

function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";

    dataArr.forEach(function (rowArr) {
        let row = rowArr.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}

function exportCSV2() {
    let csvContent;

    dataArr.forEach(function (rowArr) {
        let row = rowArr.join(",");
        csvContent += row + "\r\n";
    });

    let dateStr = getSaveDate();
    const blobData = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    var reader = new FileReader();
    reader.onload = function () {
        var popup = window.open();
        var link = document.createElement("a");
        link.setAttribute("href", reader.result);
        link.setAttribute("download", "datawalking-" + dateStr + ".csv");
        popup.document.body.appendChild(link);
        link.click();
    };
    reader.readAsDataURL(blobData);
}

getLocation();

resetDataBtn.addEventListener("click", resetData);
exportCSVBtn.addEventListener("click", exportCSV2);
exportGeoJsonBtn.addEventListener("click", exportJson2);

addButton.addEventListener("click", countPress);