// Define the url for the GeoJSON earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function (data) {
    function drawstyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.8,
            fillColor: fillcolour(feature.geometry.coordinates[2]),
            color: "black",
            radius: drawradius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };

        
    }

    // Get colors based on depth
    function fillcolour(depthCoordinate) {
        switch (true) {
            case depthCoordinate > 90:
                return "darkblue";
            case depthCoordinate > 70:
                return "purple";
            case depthCoordinate > 50:
                return "red";
            case depthCoordinate > 30:
                return "orange";
            case depthCoordinate > 10:
                return "pink";
            default:
                return "yellow";
        }
    }

    // get the magnitude size
    function drawradius(mag) {
        if (mag === 0) {
            return 1;
        }

        return mag * 3;
    }

    // Add earthquake data to the map
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: drawstyle,

        // Activate pop-up data when circles are clicked
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

        }
    }).addTo(myMap);

    // Add the legend with colors to corrolate with depth
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend"),
            depth = [-10, 10, 30, 50, 70, 90];

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + fillcolour(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        console.log(div.innerHTML)
        return div;
    };
    legend.addTo(myMap)
});
