"use strict";

window.getResults = function () {
  var $ = document.querySelector.bind(document);

  function init() {
    var uri = URI(window.location.href);
    var position = {
      lat: +uri.query(true).lat,
      lng: +uri.query(true).lng
    };

    getPlaces(position).then(listPlaces).catch(handleError);
  }

  function listPlaces(places) {
    var template = $("#tmp-card-place");
    var results = $("#results");

    var _loop = function _loop(i) {
      var card = document.importNode(template.content.firstElementChild, true);
      var placeName = card.querySelector(".js-place-name");
      var placeLocation = card.querySelector(".js-place-location");
      placeName.innerHTML = places[i].name;
      placeLocation.innerHTML = places[i].vicinity;
      results.appendChild(card);

      // Make the results page responsive.
      // If the screen width is larger than 800px...
      if (window.innerWidth >= 800) {
        // Then the results page has enough space in it
        // to fit both the results cards on the left,
        // and to display the selected place on the right.
        // Displaying the place is done by simply changing
        // the source of an <iframe>.
        card.addEventListener("click", function () {
          var iframe = $("#iframe-place");
          iframe.classList.remove("hidden");
          iframe.src = "./place.html?id=" + places[i].place_id;
          // Subtract the 30px that are padding.
          iframe.style.height = $("html").offsetHeight - 30 + "px";
        });
      } else {
        // If the screen isn't large enough, then display the
        // place details on a page of its own.
        card.addEventListener("click", function () {
          window.location.href = "./place.html?id=" + places[i].place_id;
        });
      }
    };

    for (var i = 0; i < places.length; i++) {
      _loop(i);
    }
  }

  function getPlaces(position) {
    return new Promise(function (resolve, reject) {
      var request = {
        location: position,
        radius: 3000,
        type: "meal_delivery"
      };
      var container = $("#places-service");
      var service = new google.maps.places.PlacesService(container);
      service.nearbySearch(request, function (data, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(data);
        } else {
          reject(status);
        }
      });
    });
  }

  function handleError(code) {
    switch (code) {
      case "ZERO_RESULTS":
        $("#zero-results").classList.remove("hidden");
        break;
    }
  }

  return {
    init: init
  };
}();