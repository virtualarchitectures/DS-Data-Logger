// Geolocation
function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, failPosition);
    navigator.geolocation.watchPosition(trackPosition);
    console.log("Geo location enabled");
  } else {
    console.log("Geo location failed");
    geoEnabled.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  geoEnabled.innerHTML = "geolocation enabled";
  geoEnabled.style.visibility = "hidden";
  var s = document.getElementById("shield");
  s.style.visibility = "hidden";
}

function failPosition(error) {
  if (error.code == error.PERMISSION_DENIED) {
    console.log("Geolocation access denied");
    // you could hide elements, but currently covered by the shield
  } else {
    console.log("Other error");
  }
}

function trackPosition(position) {
  window.currPosition = position;
}

function getSaveDate() {
  let saveDate = new Date();
  let yr = currDate.getFullYear();
  let mo = currDate.getMonth() + 1;
  let dt = currDate.getDate();
  let hr = currDate.getHours();
  let mn = currDate.getMinutes();
  let sc = currDate.getSeconds();

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

// CSV Export
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

// GeoJSON Export
function exportJson() {
  console.log("export geojson...");
  console.log(myJson);

  // Convert object to Blob
  const blobData = new Blob([JSON.stringify(myJson, undefined, 2)], {
    type: "text/json;charset=utf-8",
  });

  // Convert Blob to URL
  const blobUrl = URL.createObjectURL(blobData);

  // Create an a element with blobl URL
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

  let dateStr = getSaveDate(); //yr+"-"+mo+"-"+dt+"-"+hr+"-"+mn+"-"+sc;

  // Convert object to Blob
  const blobData = new Blob([JSON.stringify(myJson, undefined, 2)], {
    type: "text/json;charset=utf-8",
  });

  //
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
