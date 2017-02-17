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
    for (let i = 0; i < places.length; i++) {
      const card = document.importNode(template.content.firstElementChild, true);
      const placeName = card.querySelector(".js-place-name");
      const placeLocation = card.querySelector(".js-place-location");
      placeName.innerHTML = places[i].name;
      placeLocation.innerHTML = places[i].vicinity;
      results.appendChild(card);

      card.addEventListener("click", function() {
        window.location.href = `./place.html?id=${places[i].place_id}`;
      });
    }
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