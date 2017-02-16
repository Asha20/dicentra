"use strict";

var getPlaceDetails = function () {
  var $ = document.querySelector.bind(document);

  function init() {
    var uri = URI(window.location.href);
    var placeID = uri.query(true).id;

    getPlaceDetails(placeID).then(displayData).catch(console.log);
  }

  function getPlaceDetails(placeId) {
    return new Promise(function (resolve, reject) {
      var element = $("#details");
      var request = { placeId: placeId };
      var service = new google.maps.places.PlacesService(element);

      service.getDetails(request, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          reject(status);
        }
      });
    });
  }

  function loadPhoto(photo) {
    var card = document.createElement("section");
    card.className = "card  text-center";
    $("body").insertBefore(card, $("#place-info-card"));

    var imageElement = document.createElement("img");
    imageElement.className = "center";
    imageElement.style.marginBottom = "10px";
    card.appendChild(imageElement);

    // Checks in case the image link is broken;
    // No point in displaying the card if it is.
    imageElement.onerror = function () {
      card.classList.add("hidden");
    };
    imageElement.src = photo.getUrl({ maxWidth: card.offsetWidth });

    if (photo.html_attributions && photo.html_attributions[0]) {
      var attributionLink = photo.html_attributions[0];
      var attribution = document.createElement("span");
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
    var infoWrapper = document.createElement("div");
    var term = document.createElement("dt");
    var description = document.createElement("dd");
    term.innerHTML = info.name;
    description.innerHTML = info.value;
    infoWrapper.appendChild(term);
    infoWrapper.appendChild(description);
    $("#place-info").appendChild(infoWrapper);
  }

  function displayData(place) {
    console.log(place);
    $("#place-name").innerHTML = place.name;

    if (place.photos && place.photos[0]) {
      loadPhoto(place.photos[0]);
    }

    var details = [{
      name: "Website",
      value: place.website || null
    }, {
      name: "Address",
      value: place.formatted_address || null
    }, {
      name: "Phone Number",
      value: place.formatted_phone_number || null
    }, {
      name: "International Phone Number",
      value: place.international_phone_number || null
    }];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = details[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var info = _step.value;

        displayInformation(info);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  init();
}();