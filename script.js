var quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log (quakes)

function markerSize(mag) {
    return mag * 4;
};

var earthquakes = new L.LayerGroup();
d3.json(quakes, function (geoJson){

    console.log(geoJson)

    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag)});
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.8,
                weight: 2,
                color: 'white'

            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
        
    }).addTo(earthquakes);
    createMap(earthquakes);
});



function Color(mag) {
    if (mag > 5) {
        return '#f06b6b'
    } else if (mag > 4) {
        return '#f0a76b'
    } else if (mag > 3) {
        return '#f3ba4d'
    } else if (mag > 2) {
        return '#f3db4d'
    } else if (mag > 1) {
        return '#e1f34d'
    } else {
        return '#b7f34d'
    }
};

function createMap() {

    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: API_KEY
    });
    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });
    var baseLayers = {
        "High Contrast": highContrastMap,
        "Dark": darkMap
    };
    var overlays = {
        "Earthquakes": earthquakes,
    };
    var mymap = L.map('mapid', {
        center: [40, -160],
        zoom: 2.8,  
        layers: [highContrastMap, earthquakes,]
    });
    L.control.layers(baseLayers, overlays).addTo(mymap);

// Legend Function/Var
// Places in bottom right
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5],
            labels = [];
        div.innerHTML += "<h5 style='margin:4px'>Magnitude Legend</h5>"
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(mymap);
  }