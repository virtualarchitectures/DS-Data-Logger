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

//----------GEOJSON DATA MANAGEMENT----------//

// GeoJSON data object initialization
var myJson = {
  type: "FeatureCollection",
  features: [],
};

//----------VARIABLE INITIALIZATION----------//

// Variables for geolocation, time, buttons, and data initialization
var geoEnabled = document.getElementById("geo-enabled");

//----------GEOLOCATION AND EVENT LISTENERS----------//

// Geolocation initialization
getGeolocation();

function getNearbyAddresses() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        document.getElementById(
          "location"
        ).textContent = `Your location: Latitude ${lat.toFixed(
          5
        )}, Longitude ${lon.toFixed(5)}`;

        // Correct Nominatim API endpoint for searching nearby addresses
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1&zoom=18`;

        try {
          const response = await fetch(url, {
            headers: { "User-Agent": "ExampleApp/1.0" }, // Nominatim requires this
          });
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            const dropdown = document.getElementById("addressDropdown");
            dropdown.innerHTML = "";

            // Populate dropdown with multiple results
            data.forEach((place) => {
              const option = document.createElement("option");
              option.text = place.display_name || "Address not found";
              option.value = place.display_name;
              dropdown.add(option);
            });
          } else {
            alert("No addresses found.");
          }
        } catch (error) {
          alert("Error fetching addresses: " + error.message);
        }
      },
      (error) => {
        alert("Geolocation error: " + error.message);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
