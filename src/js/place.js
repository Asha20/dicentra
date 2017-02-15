const getPlaceDetails = (function() {
  const $ = document.querySelector.bind(document);

  function init() {
    const uri = URI(window.location.href);
    const placeID = uri.query(true).id;

    getPlaceDetails(placeID)
    .then(displayData)
    .catch(console.log);
  }


  function getPlaceDetails(placeId) {
    return new Promise(function(resolve, reject) {
      const element = $("#details");
      const request = {placeId};
      const service = new google.maps.places.PlacesService(element);

      service.getDetails(request, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          reject(status);
        }
      });
    });
  }


  function loadPhoto(photo) {
    const card = document.createElement("section");
    card.className = "card  text-center";
    $("body").appendChild(card);

    const imageElement = document.createElement("img");
    imageElement.className = "center";
    imageElement.style.marginBottom = "10px";
    card.appendChild(imageElement);

    // Checks in case the image link is broken;
    // No point in displaying the card if it is.
    imageElement.onerror = function() {
      card.classList.add("hidden");
    }
    imageElement.src = photo.getUrl({maxWidth: card.offsetWidth});

    if (photo.html_attributions && photo.html_attributions[0]) {
      const attribution = photo.html_attributions[0];
      card.insertAdjacentHTML("beforeend", `Photo by: ${attribution}`);
    }
  }


  function displayData(place) {
    $("#place-name").innerHTML = place.name;

    if (place.photos && place.photos[0]) {
      loadPhoto(place.photos[0]);
    }
  }

  init();
})();