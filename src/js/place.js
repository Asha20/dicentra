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
    $("body").insertBefore(card, $("#place-info-card"));

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
      const attributionLink = photo.html_attributions[0];
      const attribution = document.createElement("span");
      attribution.innerHTML = "Photo by: ";
      attribution.insertAdjacentHTML("beforeend", attributionLink);
      card.appendChild(attribution);
    }
  }


  function displayInformation(info) {
    if (info.value === null) {
      return;
    }

    // The term and description elements have an inline
    // display, so a block display element (infoWrapper)
    // is used to display data in rows.
    const infoWrapper = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.innerHTML = info.name;
    if (info.name === "Website") {
      const websiteLink = document.createElement("a");
      websiteLink.href = websiteLink.innerHTML = info.value;
      description.appendChild(websiteLink);
    } else {
      description.innerHTML = info.value;
    }
    infoWrapper.appendChild(term);
    infoWrapper.appendChild(description);
    $("#place-info").appendChild(infoWrapper);
  }


  function makeStarRating(rating) {
    const ratingStars = document.createElement("section");
    ratingStars.className = "rating__stars";

    for (let i = 0; i < 5; i++) {
      const starWrapper = document.createElement("div");
      starWrapper.className = "star-wrapper";
      const star = document.createElement("img");
      star.className = "star";
      star.src = (i < Math.round(rating)) ?
        "./dist/img/star.png" : "./dist/img/star-missing.png";

      starWrapper.appendChild(star);
      ratingStars.appendChild(starWrapper);
    }

    return ratingStars;
  }


  function displayRating(rating) {
    $("#rating").appendChild(makeStarRating(rating));

    // Numerical rating
    const ratingNumber = document.createElement("section");
    ratingNumber.className = "rating__number";
    const ratingElement = document.createElement("span");
    ratingElement.className =
      "rating--numerical  block  text-center";
    ratingElement.innerHTML = `${rating}/5`;

    ratingNumber.appendChild(ratingElement);

    $("#rating").appendChild(ratingNumber);
  }


  function displayData(place) {
    console.log(place);
    $("#place-name").innerHTML = place.name;

    if (place.photos && place.photos[0]) {
      loadPhoto(place.photos[0]);
    }

    const details = [
      {
        name: "Website",
        value: place.website || null
      },
      {
        name: "Address",
        value: place.formatted_address || null
      },
      {
        name: "Phone Number",
        value: place.formatted_phone_number || null
      },
      {
        name: "International Phone Number",
        value: place.international_phone_number || null
      }
    ];

    for (let info of details) {
      displayInformation(info);
    }

    if (place.rating) {
      displayRating(place.rating);
    }
  }

  init();
})();