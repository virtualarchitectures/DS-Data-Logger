//----------GEOLOCATION----------//

// Function to get the current location of the user
function getGeolocation() {
  if (navigator.geolocation) {
    // If geolocation is available, set up position tracking
    navigator.geolocation.getCurrentPosition(showPosition, failPosition);
    navigator.geolocation.watchPosition(trackPosition);
    console.log("Geo location enabled");
  } else {
    // Handle case when geolocation is not supported
    console.log("Geo location failed");
    geoEnabled.innerHTML = "Geolocation is not supported by this browser.";
  }
}

// Function to handle successful geolocation
function showPosition(position) {
  // Show position when geolocation is enabled
  geoEnabled.innerHTML = "geolocation enabled";
  geoEnabled.style.visibility = "hidden";
  var s = document.getElementById("shield");
  // Hide shield if geolocation is enabled
  s.style.visibility = "hidden";
}

// Function to handle geolocation failures
function failPosition(error) {
  // Handle geolocation failures
  if (error.code == error.PERMISSION_DENIED) {
    console.log("Geolocation access denied");
  } else {
    console.log("Other error");
  }
}

// Function to handle geolocation updates
function trackPosition(position) {
  // Update global variable with current position
  window.currPosition = position;
}

//----------MAP VISUALISATION----------//

// Function to update the map with new GeoJSON data
function mapJson() {
  // Clear existing data in the geoJsonLayer
  geoJsonLayer.clearLayers();

  // Add new data to the geoJsonLayer
  geoJsonLayer.addData(myJson);

  // Adjust map view to fit the newly added data
  if (myJson.features.length > 0) {
    var bounds = geoJsonLayer.getBounds();
    map.fitBounds(bounds);
  }

  console.log("Map updated with new data.");
}

//----------DATA PREPARATION AND HANDLING----------//

// Function to create a GeoJSON feature
function createJson(
  id,
  latitude,
  longitude,
  altitude,
  timestamp,
  iso_date,
  date,
  time,
  properties = {}
) {
  console.log("Adding to GeoJSON");
  const baseFeature = {
    type: "Feature",
    properties: {
      id,
      timestamp,
      "iso-date": iso_date,
      date,
      time,
      ...properties,
    },
    geometry: { type: "Point", coordinates: [longitude, latitude] },
  };

  if (altitude !== null) {
    baseFeature.geometry.coordinates.push(altitude);
  }

  myJson.features.push(baseFeature);
  console.log(myJson);
}

// Function to format the current date/time
function formatCurrentDateTime() {
  const currDate = new Date();
  const yr = currDate.getFullYear();
  const mo = (currDate.getMonth() + 1).toString().padStart(2, "0");
  const dt = currDate.getDate().toString().padStart(2, "0");
  const hr = currDate.getHours().toString().padStart(2, "0");
  const mn = currDate.getMinutes().toString().padStart(2, "0");
  const sc = currDate.getSeconds().toString().padStart(2, "0");

  const tzOffset = -currDate.getTimezoneOffset();
  const tzHr = String(Math.floor(tzOffset / 60)).padStart(2, "0");
  const tzMn = String(Math.abs(tzOffset % 60)).padStart(2, "0");
  const tzSign = tzOffset >= 0 ? "+" : "-";

  return {
    fullDate: `${yr}-${mo}-${dt}T${hr}:${mn}:${sc}`,
    date: `${yr}-${mo}-${dt}`,
    time: `${hr}:${mn}:${sc}`,
    isoDateTime: `${yr}-${mo}-${dt}T${hr}:${mn}:${sc}${tzSign}${tzHr}:${tzMn}`,
    saveDate: `${yr}-${mo}-${dt}-${hr}-${mn}-${sc}`,
  };
}

// Function to reset data arrays, trackers and map layer before saving new data
function resetData(
  dataArr,
  dataHead,
  countArr,
  countTrackers,
  geoJsonObj,
  map,
  geoJsonLayer
) {
  // Reset ID
  let id = 0;

  // Reset data array with headers
  dataArr.length = 0;
  dataArr.push(dataHead);

  // Reset count array
  countArr.fill(0);

  // Reset count tracker display elements
  countTrackers.forEach((tracker) => {
    tracker.innerHTML = "0";
  });

  // Clear map layer
  geoJsonLayer.clearLayers();

  // Reset GeoJSON object
  geoJsonObj.type = "FeatureCollection";
  geoJsonObj.features.length = 0;

  console.log(dataArr);
}

//----------DATA EXPORT----------//

function exportCSV() {
  // Create an initialized CSV content string
  let csvContent;

  // Convert each data array to a CSV row and append to CSV content
  dataArr.forEach(function (rowArr) {
    let row = rowArr.join(",");
    csvContent += row + "\r\n";
  });

  // Get a formatted current date string
  let dateStr = formatCurrentDateTime().saveDate; // Use saveDate format

  // Create a Blob for the CSV data
  const blobData = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

  // Set up FileReader to read the Blob and trigger a download
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

function exportJson() {
  // Get a formatted current date string
  let dateStr = formatCurrentDateTime().saveDate; // Use saveDate format

  // Convert GeoJSON object to a Blob
  const blobData = new Blob([JSON.stringify(myJson, undefined, 2)], {
    type: "text/json;charset=utf-8",
  });

  // Set up FileReader to read the Blob and trigger a download
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
