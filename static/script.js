mapboxgl.accessToken = 'pk.eyJ1Ijoicm95YXI1OTUiLCJhIjoiY2xiam9qYXcxMDlyNjNucnB0YTJ5ZnVicyJ9.rncE9H9zigc00H7go3LpOg';

// initialize the map
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/royar595/clfjk40c2000001oyfub0qxby', // style URL
    center: [-127.54165, 35.18298], // starting position [lng, lat] -83.119056
    zoom: 18, // starting zoom,
    pitch: 45, // pitch in degrees
});

map.on('load', () => {
    map.addSource('links', {
        type: 'vector',
        url: 'mapbox://royar595.simple-links',
        promoteId: "id", 
    }); 
    
    map.addLayer({
        'id': 'links',
        'type': 'line',
        'source': 'links',
        'source-layer': 'links',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-width': 7,
            "line-color": [
                "case", // begin case expression
                ["==", ["feature-state", "conduit_flow"], null], // if the flow in the conduit == null,
                "white", // ...then color the line white
                ["==", ["feature-state", "conduit_flow"], 0], // if the flow in the conduit == 0,
                '#c2c2c3', // ...then color the line grey
                [
                  // interpolate linearly using the feature-state flow
                  "interpolate",
                  ["linear"],
                  ["feature-state", "conduit_flow"],
                  // The subsequent values are essentially the "steps" in our color scale, consisting of
                  // "case count" and "color" pairs. The fill color will be linearly interpolated between
                  // the defined steps.
                  0,
                  '#a8a8a8',  
                  0.1, 
                  '#EE9B00', 
                  0.2,
                  '#9B2226',

            ],
          ],
        },
    });

    map.addSource('storage', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {'type': 'Feature',
                    'properties': {'description':'storage'},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-127.54190, 35.18302] // icon position [lng, lat]
                }},

            ]
        }
    });

    map.addLayer({
        'id': 'storage',
        'type': 'symbol',
        'source': 'storage',
        'layout': {
            'text-field': ['get','description'],
            "text-font": ["Arial Unicode MS Bold"],
            "text-size": 18,
            "text-variable-anchor": ['bottom'],
            "text-justify": "auto",
            "text-radial-offset": 1.5,
            'icon-image': 'us-state-square-2',
            'icon-allow-overlap':true,
        },
        'paint': {
            'text-color': "#BF40BF",
        }
    });

    map.addSource('outfall_1', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {'type': 'Feature',
                    'properties': {'id':3,'description':'outfall 1'},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-127.54148, 35.18288],
                }},
            ]
        }
    });

    map.addLayer({
        'id': 'outfall_1',
        'type': 'symbol',
        'source': 'outfall_1',
        'layout': {
            'text-field':['get','description'],
            "text-font": ["Arial Unicode MS Bold"],
            "text-size": 18,
            "text-variable-anchor": ['top-right'],
            "text-justify": "auto",
            "text-radial-offset": 0.5,
            'icon-image':'dot-11',
            'icon-size':1.5,
            'icon-allow-overlap':true,
        },
        'paint': {
            'text-color': "#0a9396",
        }
    });

    map.addSource('outfall_2', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [


                {'type': 'Feature',
                'properties': {'id':4, 'description':'outfall 2'},
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-127.54145, 35.18293], // icon position [lng, lat]
                }},
            ]
        }
    });

    map.addLayer({
        'id': 'outfall_2',
        'type': 'symbol',
        'source': 'outfall_2',
        'layout': {
            'text-field':['get','description'],
            "text-font": ["Arial Unicode MS Bold"],
            "text-size": 18,
            "text-variable-anchor": ['bottom'],
            "text-justify": "auto",
            "text-radial-offset":1,
            'icon-image':'dot-11',
            'icon-size':1.5,
            'icon-allow-overlap':true,
        },
        'paint': {
            'text-color': "#52b788",
        }
    });


     map.addSource('junction_1', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {'type': 'Feature',
                    'properties': {'description':'gate 1'},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-127.54184, 35.18298] // icon position [lng, lat]
                }},
            ]
        }
    });

    map.addLayer({
        'id': 'junction_1',
        'type': 'symbol',
        'source': 'junction_1',
        'layout': {
            'text-field': ['get','description'],
            "text-font": ["Arial Unicode MS Bold"],
            "text-size": 18,
            "text-variable-anchor": ["top-right"],
            "text-justify": "right",
            "text-radial-offset": 0.5,
            'icon-image': 'gate',
            'icon-allow-overlap':true,
            'text-allow-overlap':true,
        },
        'paint': {
            'text-color': "#0a9396",
        }
    });

    map.addSource('junction_2', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {'type': 'Feature',
                    'properties': {'description':'gate 2'},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-127.54183, 35.18302] // icon position [lng, lat]
                }}
            ]
        }
    });

    map.addLayer({
        'id': 'junction_2',
        'type': 'symbol',
        'source': 'junction_2',
        'layout': {
            'text-field': ['get','description'],
            "text-font": ["Arial Unicode MS Bold"],
            "text-size": 18,
            "text-variable-anchor": ["bottom-left"],
            "text-justify": "right",
            "text-radial-offset": 1,
            'icon-image': 'gate',
            'icon-allow-overlap':true,
            'text-allow-overlap':true,
        },
        'paint': {
            'text-color': "#52b788",
        }
    });
})

$(document).ready(function() {
    // Connect to the Socket.IO server.
    // The connection URL has the following format, relative to the current page:
    //     http[s]://<domain>:<port>[/<namespace>]
    var socket = io();

    // when the start button is pressed, emit that the button has been pressed
    $('form#start').submit(function(event) {
        socket.emit('start_button', {data: 'pressed'});
        return false;
    });
 
    // when the gate 1 slider changes, emit the new value
    $('input#gate_1_slider').on('input', function(event) {
        socket.emit('gate_1_change', {
            who:$(this).attr('id'),  
            data: $(this).val()
            });
            return false;
        });
    
    // when the gate 2 slider changes, emit the new value    
    $('input#gate_2_slider').on('input', function(event) {
    socket.emit('gate_2_change', {
        who:$(this).attr('id'),  
        data: $(this).val()
        });
        return false;
    });

    // when we get a gate 1 update back from Python, update the tracker in the UI
    socket.on('gate_1_update', function(msg) {
        $('#gate_1_slider_tracker').text($('<div/>').text(msg.data).html());
    });

    socket.on('gate_2_update', function(msg) {
        $('#gate_2_slider_tracker').text($('<div/>').text(msg.data).html());
    });

    socket.on('percent_update', function(msg) {
        $('#sim_percent_tracker').text($('<div/>').text(msg.data).html());
    })

    socket.on('outfall_1_update', function(msg) {
        $('#outfall_1_tracker').text($('<div/>').text(msg.data).html());
    })

    socket.on('outfall_2_update', function(msg) {
        $('#outfall_2_tracker').text($('<div/>').text(msg.data).html());
    })

    // set up the chart
    Chart.defaults.font.size = 16;
    Chart.defaults.color = '#a8a8a8';
    Chart.defaults.animation = false;
    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {label:'current',
                data: [],
                borderColor: '#BF40BF',
                pointRadius: 0}, 

                {label:'baseline',
                data: [],
                borderColor: '#a8a8a8',
                pointRadius: 0},
            ]
        },
        options:{
            scales:{
               x: {
                display:false, // turn off the vertical gridlines on the plot
                },
            },
            plugins: {
                legend: {
                    display: false
                },

                title: {
                    display: true,
                    text: 'Storage Depth (m)'
                }
            }
        }
    });

    // when we get a flow update from Python, update the map using Mapbox's setFeatureState
    socket.on('flow_update', function(flow_json) {
        const flow_obj = JSON.parse(flow_json)
        for (const flow_item of flow_obj) {
            map.setFeatureState({
                source: "links",
                sourceLayer: "links",
                id: flow_item.geoid},
                {conduit_flow:flow_item.flow}
            );
        };
    });

    // update the chart with both the baseline and the current flow
    socket.on('baseline_update', function(depth) {
        chart.data.labels.push('1'); // 1 is just a placeholder value
        chart.data.datasets[1].data.push(depth)
        chart.update()
    });

    socket.on('storage_update', function(depth) {
        chart.data.datasets[0].data.push(depth)
        chart.update()
    });
    
});