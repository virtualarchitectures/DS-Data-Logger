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

// Function to generate a timestamp for saving data
function getSaveDate() {
  let saveDate = new Date();
  let yr = currDate.getFullYear();
  let mo = currDate.getMonth() + 1;
  let dt = currDate.getDate();
  let hr = currDate.getHours();
  let mn = currDate.getMinutes();
  let sc = currDate.getSeconds();

  // Format date/time values with leading zeros if necessary
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

  return yr + "-" + mo + "-" + dt + "-" + hr + "-" + mn + "-" + sc;
}

// Function to reset data arrays and trackers before saving new data
function resetData(dataArr, dataHead, countArr, countTrackers, geoJsonObj) {
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

  // Reset GeoJSON object
  geoJsonObj.type = "FeatureCollection";
  geoJsonObj.features.length = 0;

  console.log(dataArr);
}

//----------DATA EXPORT----------//

// CSV Export Functions
function exportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Convert each data array to a CSV row and append to CSV content
  dataArr.forEach(function (rowArr) {
    let row = rowArr.join(",");
    csvContent += row + "\r\n";
  });

  // Encode CSV content as a URI and open it in a new window
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}

function exportCSV2() {
  // Create an initialized CSV content string
  let csvContent;

  // Convert each data array to a CSV row and append to CSV content
  dataArr.forEach(function (rowArr) {
    let row = rowArr.join(",");
    csvContent += row + "\r\n";
  });

  // Get a formatted current date string
  let dateStr = getSaveDate();

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

// GeoJSON Export Functions
function exportJson() {
  console.log("export geojson...");
  console.log(myJson);

  // Convert GeoJSON object to a Blob
  const blobData = new Blob([JSON.stringify(myJson, undefined, 2)], {
    type: "text/json;charset=utf-8",
  });

  // Create a URL for the Blob
  const blobUrl = URL.createObjectURL(blobData);

  // Create a link element to trigger a download
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.target = "_self";
  anchor.download = "datawalking.geojson";

  // Trigger the file download
  anchor.click();

  // Clean up the Blob URL
  URL.revokeObjectURL(blobUrl);
}

function exportJson2() {
  console.log("export geojson new way 2...");
  console.log(myJson);

  // Get a formatted current date string
  let dateStr = getSaveDate();

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
