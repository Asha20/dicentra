let getLocation = (function() {
  const $ = document.querySelector.bind(document);

  function getLocation() {
    return new Promise(function(resolve, reject) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          const coords = {
            lat: Number(position.coords.latitude.toFixed(3)),
            lng: Number(position.coords.longitude.toFixed(3))
          };

          resolve(coords);
        }, function(error) {
          reject("GEOLOCATION_FAILED");
        });
      } else {
        reject("GEOLOCATION_UNSUPPORTED");
      }
    });
  }

  $("#search").addEventListener("click", function() {
    getLocation()
    .then(console.log)
    .catch(console.log);
  })
})();