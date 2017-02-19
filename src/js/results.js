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
      .catch(handleError);
  }


  function listPlaces(places) {
    const template = $("#tmp-card-place");
    const results = $("#results");
    for (let i = 0; i < places.length; i++) {
      const card =
        document.importNode(template.content.firstElementChild, true);
      const placeName = card.querySelector(".js-place-name");
      const placeLocation = card.querySelector(".js-place-location");
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
        card.addEventListener("click", function() {
          const iframe = $("#iframe-place");
          iframe.classList.remove("hidden");
          iframe.src = `./place.html?id=${places[i].place_id}`;
          // Subtract the 30px that are padding.
          iframe.style.height = $("html").offsetHeight - 30 + "px";
        })
      } else {
        // If the screen isn't large enough, then display the
        // place details on a page of its own.
        card.addEventListener("click", function() {
          window.location.href = `./place.html?id=${places[i].place_id}`;
        });
      }
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


  function handleError(code) {
    switch(code) {
      case "ZERO_RESULTS":
        $("#zero-results").classList.remove("hidden");
        break;
    }
  }


  return {
    init
  };
})();