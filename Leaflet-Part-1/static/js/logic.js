// Create the map object
let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
});

// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Save the url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"


// Get the data using D3
// d3.json(url).then(function(earthquakeData) {
//     console.log(earthquakeData);
//     // Grab the location and depth
//     console.log(earthquakeData.features);
//     // Latitude
//     console.log(earthquakeData.features[0].geometry.coordinates[0]);
//     // Longitude
//     console.log(earthquakeData.features[0].geometry.coordinates[1]);
//     // Depth
//     console.log(earthquakeData.features[0].geometry.coordinates[2]);

//     // Collect metadata
//     console.log(earthquakeData.features[0].properties);
//     // Magnitude
//     console.log(earthquakeData.features[0].properties.mag);
//     // Title of place
//     console.log(earthquakeData.features[0].properties.title);

// });

// Create function to assign circle sizes based on magnitude (higher mag = larger circle)
function magSize(magnitude) {
    return Math.pow(2, magnitude) * 5000;
}

// Create function to assign circle colors based on depth
function depthColor(depth) {
    if (depth < 10) return "LimeGreen";
    else if (depth < 30) return "GreenYellow";
    else if (depth < 50) return "Yellow";
    else if (depth < 70) return "Orange";
    else if (depth < 90) return "DarkOrange";
    else return "Red";    

}

// Get data
d3.json(url).then(function(earthquakeData) {
    // Loop through all objects in dataset
    earthquakeData.features.forEach(function(data) {
        // Save coordinates as objects
        let longitude = data.geometry.coordinates[0];
        let latitude = data.geometry.coordinates[1];
        let depth = data.geometry.coordinates[2];
        let magnitude = data.properties.mag;
        let title = data.properties.title;

        // Create layer
        let circle = L.circle([latitude, longitude], {
            color: "black",
            fillColor: depthColor(depth),
            fillOpacity: 0.6,
            radius: magSize(magnitude),
            weight: 1
        }).addTo(myMap);

        circle.bindPopup("<h3>" + title + "</h3> <hr> <p>" + 
        "Coordinates: " + longitude + ", " + latitude + ", " + depth + "</p> <p>" +
        "Magnitude: " + magnitude + "</p> <p>" + 
        "Depth: " + depth + "</p>");
    });
    // Add legend
    let legendRanges = "<h3>Depth</h3>" +
                    "<p><span style='background-color: LimeGreen'></span> < 10</p>" +
                    "<p><span style='background-color: GreenYellow'></span> 10 - 30</p>" +
                    "<p><span style='background-color: Yellow'></span> 30 - 50</p>" +
                    "<p><span style='background-color: Orange'></span> 50 - 70</p>" +
                    "<p><span style='background-color: DarkOrange'></span> 70 - 90</p>" +
                    "<p><span style='background-color: Red'></span> 90+</p>";

    let legend = L.control({position: "bottomright"});

    legend.onAdd = function (myMap) {
        let div = L.DomUtil.create("div", "info legend");
        div.innerHTML = legendRanges;
        return div;
    };
    legend.addTo(myMap);
});
