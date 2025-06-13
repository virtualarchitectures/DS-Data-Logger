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

        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1&zoom=18&namedetails=1`;

        try {
          const response = await fetch(url, {
            headers: {
              "User-Agent": "ExampleApp/1.0",
            },
          });
          const mainAddress = await response.json();

          const searchUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${mainAddress.display_name}&limit=10&addressdetails=1`;

          const nearbyResponse = await fetch(searchUrl, {
            headers: {
              "User-Agent": "ExampleApp/1.0",
            },
          });
          const nearbyAddresses = await nearbyResponse.json();
          const dropdown = document.getElementById("addressDropdown");
          dropdown.innerHTML = '<option value="">Select an address...</option>';

          if (nearbyAddresses.length > 0) {
            nearbyAddresses.forEach((place) => {
              const option = document.createElement("option");
              option.text = place.display_name;
              option.value = JSON.stringify({
                address: place.display_name,
                lat: place.lat,
                lon: place.lon,
              });
              dropdown.add(option);
            });

            dropdown.style.display = "block";
          } else {
            alert("No nearby addresses found.");
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
          alert("Error fetching addresses. Please try again later.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert(
          "Unable to get your location. Please check your location permissions."
        );
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
