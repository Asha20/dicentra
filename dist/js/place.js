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

    // Subtracting 20 from the total card width to account
    // for padding.
    imageElement.src = photo.getUrl({ maxWidth: card.offsetWidth - 20 });

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
    if (info.name === "Website") {
      var websiteLink = document.createElement("a");
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
    var ratingStars = document.createElement("section");
    ratingStars.className = "rating__stars";

    for (var i = 0; i < 5; i++) {
      var starWrapper = document.createElement("div");
      starWrapper.className = "star-wrapper";
      var star = document.createElement("img");
      star.className = "star";
      star.src = i < Math.round(rating) ? "./dist/img/star.png" : "./dist/img/star-missing.png";

      starWrapper.appendChild(star);
      ratingStars.appendChild(starWrapper);
    }

    return ratingStars;
  }

  function displayRating(rating) {
    $("#rating").appendChild(makeStarRating(rating));

    // Numerical rating
    var ratingNumber = document.createElement("section");
    ratingNumber.className = "rating__number";
    var ratingElement = document.createElement("span");
    ratingElement.className = "rating--numerical  block  text-center";
    ratingElement.innerHTML = rating + "/5";

    ratingNumber.appendChild(ratingElement);

    $("#rating").appendChild(ratingNumber);
  }

  function displayReviews(reviews) {
    var _loop = function _loop(i) {
      var review = document.importNode($("#tmp-review").content.firstElementChild, true);
      $("#reviews").appendChild(review);

      var userPhoto = review.querySelector(".review__user-photo");
      userPhoto.onerror = function () {
        userPhoto.src = "./dist/img/user-profile.png";
      };
      userPhoto.src = "https://" + reviews[i].profile_photo_url;

      var userName = review.querySelector(".review__user-name");
      userName.href = reviews[i].author_url;
      userName.innerHTML = reviews[i].author_name;

      var relativeTime = review.querySelector(".review__relative-time");
      relativeTime.innerHTML = reviews[i].relative_time_description;

      var rating = makeStarRating(reviews[i].rating);
      var reviewContent = review.querySelector(".review__content");
      var reviewText = review.querySelector(".review__text");
      reviewContent.insertBefore(rating, reviewText);
      reviewText.innerHTML = reviews[i].text;
    };

    for (var i = 0; i < Math.min(reviews.length, 3); i++) {
      _loop(i);
    }
  }

  function displayData(place) {
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

    if (place.rating) {
      displayRating(place.rating);
    }

    if (place.reviews && place.reviews[0]) {
      displayReviews(place.reviews);
    }
  }

  init();
}();