
let map;
var drawingManager;
var selectedShape;
var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
var defualtColor = "#1E90FF";
var selectedColor = "#FF8C00";
var colorButtons = {};
var polylines = [];
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 24.40083054344449, lng: 54.497850702044325 },
        zoom: 15,
    });

   
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYLINE,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYLINE
            ]
        },
        polylineOptions: {
            editable: true,
            draggable: false,
            strokeColor: '#1E90FF',
            strokeWeight: 4,
            fillOpacity: 0.45,

        },
       // map: map
    });
    //drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'polylinecomplete', function (polyline) {
        $("#save-button").show();
        polylines.push(polyline);
        drawingManager.setMap(null);
    });

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
        var newShape = e.overlay;
        newShape.type = e.type;
        var polylinePath = newShape.getPath();
        if (e.type !== google.maps.drawing.OverlayType.MARKER) {
            // Switch back to non-drawing mode after drawing a shape.
            drawingManager.setDrawingMode(null);

            // Add an event listener that selects the newly-drawn shape when the user
            // mouses down on it.
            google.maps.event.addListener(newShape, 'click', function (e) {

                if (e.vertex !== undefined) {
                    if (newShape.type === google.maps.drawing.OverlayType.POLYLINE) {

                        var path = newShape.getPath();
                        newShape.setOptions({ strokeColor: selectedColor });

                        /* var polylineOptions = drawingManager.get('polylineOptions');
                         polylineOptions.strokeColor = selectedColor;
                         drawingManager.set('polylineOptions', polylineOptions);
                         */
                        //  path.removeAt(e.vertex);
                        //if (path.length < 2) {
                        //  console.log("polyline 4: " + path.getArray());
                        // newShape.setMap(null);
                        // }
                        // console.log("polyline 3: " + path.getArray());

                    }
                }

                setSelection(newShape);
            });
        }
        else {
            google.maps.event.addListener(newShape, 'click', function (e) {
                setSelection(newShape);
            });
            setSelection(newShape);
        }
    });
    google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);
    google.maps.event.addDomListener(document.getElementById('clear-button'), 'click', clearSelection);
    google.maps.event.addDomListener(document.getElementById('save-button'), 'click', function () {
        var htmlStr = "";
        for (var i = 0; i < polylines.length; i++) {
            htmlStr += "polyline #" + i + " # vertices=" + polylines[i].getPath().getLength() + " length=" + google.maps.geometry.spherical.computeLength(polylines[i].getPath()).toFixed(2) + " km<br>";
            for (var j = 0; j < +polylines[i].getPath().getLength(); j++) {
                htmlStr += "&nbsp;&nbsp;" + polylines[i].getPath().getAt(j).toUrlValue(6) + "<br>";
            }
        }
       // document.getElementById('output').innerHTML = htmlStr;
    })
    /* add ployline */
    const Polyline_1 = [
        { lat: 24.410249, lng: 54.506391 },
        { lat: 24.409311, lng: 54.495834 },
        { lat: 24.401339, lng: 54.497379 },
        { lat: 24.398876, lng: 54.508022 },
        { lat: 24.404934, lng: 54.509137 },
        { lat: 24.410249, lng: 54.506391 },
    ];
    const Polyline_1Path = new google.maps.Polyline({
        path: Polyline_1,
        geodesic: true,
        editable: true,
        strokeColor: '#1E90FF',
        strokeWeight: 4,
        fillOpacity: 0.45,
    });

    Polyline_1Path.setMap(map);
    polylines.push(Polyline_1Path);


    google.maps.event.addListener(Polyline_1Path, 'click', function () {
        setSelection(Polyline_1Path);
    });
/* add ployline */

    var polylineOptions = drawingManager.get('polylineOptions');
    polylineOptions.strokeColor = defualtColor;
    drawingManager.set('polylineOptions', polylineOptions);

}


function clearSelection() {

    if (selectedShape) {
        selectedShape.setOptions({ strokeColor: defualtColor });
        selectedShape = null;
        $('#delete-button').hide();
        $('#clear-button').hide();
    }
    
}
function setSelection(shape) {
    if (selectedShape) {
        selectedShape.setOptions({ strokeColor: defualtColor });
        selectedShape = null;
    }

    selectedShape = shape;
    selectedShape.setOptions({ strokeColor: selectedColor });
  
    $('#delete-button').show();
    $('#clear-button').show();
}

function deleteSelectedShape() {

    if (selectedShape) {
        polylines.splice(
            polylines.indexOf(selectedShape), 1
        );
        console.log(polylines.length);
        selectedShape.setMap(null);
    }
    if (polylines.length == 0) {
        $('#save-button').hide();
        document.getElementById('output').innerHTML = "";
    }
    drawingManager.setMap(map);
    $('#delete-button').hide();
    $('#clear-button').hide();
}
window.initMap = initMap;