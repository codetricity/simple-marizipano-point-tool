// Create viewer.
var viewer = new Marzipano.Viewer(document.getElementById("pano"));

// Create source.
var source = Marzipano.ImageUrlSource.fromString("images/carlsbad.jpg");

// Create geometry.
var geometry = new Marzipano.EquirectGeometry([{ width: 7296 }]);

var view = new Marzipano.RectilinearView({ yaw: Math.PI });

// Create scene.
var scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
});

// Display scene.
scene.switchTo();

// Add an event listener for mouse click
document.getElementById("pano").addEventListener("mousedown", function (event) {
  document.body.style.cursor = 'move';
  let longClickTimeout;
  longClickTimeout = setTimeout(function () {
    console.log("Long click detected!");

    // Get the DOM element for the viewer
    var element = viewer.domElement();
    var rect = element.getBoundingClientRect();

    // Calculate relative pointer coordinates
    var relativeX = event.clientX - rect.left;
    var relativeY = event.clientY - rect.top;

    // Convert to normalized coordinates (0 to 1)
    var x = relativeX / rect.width;
    var y = relativeY / rect.height;

    // Use the correct method: screenToCoordinates
    var result = view.screenToCoordinates({ x: relativeX, y: relativeY });

    if (result) {
      console.log("Yaw:", result.yaw, "Pitch:", result.pitch);
      alert(`Selected point is now in clipboard:\nYaw: ${result.yaw}, Pitch: ${result.pitch}`);
      navigator.clipboard.writeText(`yaw: ${result.yaw}, pitch: ${result.pitch}`);
    } else {
      console.log("Pointer is outside the view bounds.");
    }
  }, 3000);
  // Clear the timer on mouseup or mouseout to prevent long click
  function clearLongClick() {
    clearTimeout(longClickTimeout);
    document.removeEventListener("mouseup", clearLongClick);
    document.removeEventListener("mouseout", clearLongClick);
    document.body.style.cursor = 'default';
  }

  document.addEventListener("mouseup", clearLongClick);
  document.addEventListener("mouseout", clearLongClick);
  
});
