"use strict";

var getLocation = function () {
  var $ = document.querySelector.bind(document);

  function getLocation() {
    return new Promise(function (resolve, reject) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var coords = {
            lat: Number(position.coords.latitude.toFixed(3)),
            lng: Number(position.coords.longitude.toFixed(3))
          };

          resolve(coords);
        }, function (error) {
          reject("GEOLOCATION_FAILED");
        });
      } else {
        reject("GEOLOCATION_UNSUPPORTED");
      }
    });
  }

  function showResults(coords) {
    var lat = coords.lat,
        lng = coords.lng;

    window.location.href = "./results.html?lat=" + lat + "&lng=" + lng;
  }

  function handleError(code) {
    switch (code) {
      case "GEOLOCATION_FAILED":
        $("#geolocation-failed").classList.remove("hidden");
        break;
      case "GEOLOCATION_UNSUPPORTED":
        $("#geolocation-unsupported").classList.remove("hidden");
        break;
    }
  }

  $("#search").addEventListener("click", function () {
    getLocation().then(showResults).catch(handleError);
  });
}();