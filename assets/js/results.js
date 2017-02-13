window.getResults = (function() {
  const $ = document.querySelector.bind(document);

  function init() {
    const uri = URI(window.location.href);
    const position = {
      lat: +uri.query(true).lat,
      lng: +uri.query(true).lng
    };

    getPlaces(position)
    .then(listPlaces)
    .catch(console.log);
  }


  function listPlaces(places) {
    const template = $("#tmp-card-place");
    const results = $("#results");
    places.forEach(function(place) {
      const card = document.importNode(template.content, true);
      const placeName = card.querySelector(".js-place-name");
      const placeLocation = card.querySelector(".js-place-location");
      placeName.innerHTML = place.name;
      placeLocation.innerHTML = place.vicinity;
      results.appendChild(card);
    })
  }


  function getPlaces(position) {
    return new Promise(function(resolve, reject) {
      const request = {
        location: position,
        radius: 3000,
        type: "meal_delivery"
      };
      const container = $("#places-service");
      const service = new google.maps.places.PlacesService(container);
      service.nearbySearch(request, function(data, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(data);
        } else {
          reject(status)
        }
      });
    });
  }


  return {
    init
  };
})();