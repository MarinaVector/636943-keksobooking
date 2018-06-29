'use strict';
(function () {
// создаёт pin
var renderPins = function (point) {
  var pin = templatePin.cloneNode(true);
  var pinWidth = templatePin.offsetWidth;
  var pinHeight = templatePin.offsetHeight;
  pin.style.left = point.location.x - pinWidth / 2 + 'px';
  pin.style.top = point.location.y - pinHeight + 'px';
  pin.querySelector('img').src = point.author.avatar;
  pin.querySelector('img').alt = point.offer.title;
  pin.addEventListener('click', function () {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
    pin.classList.add('map__pin--active');
    activePin = pin;
    fillCard(point);
    document.addEventListener('keydown', closeEscCardHandler);
  });
  return pin;
};
var closeEscCardHandler = function (evt) {
  if (evt.keyCode === ESC_KEY) {
    closeClickHandler();
  }
};
var closeClickHandler = function () {
  adCard.classList.add('hidden'); // делаем карточку невидимой
  activePin.classList.remove('map__pin--active'); // убираем активный пин
  document.removeEventListener('keydown', closeEscCardHandler);
};
// создаёт список фич
var renderFeatures = function (arrFeatures) {
  var fragmentFeatures = document.createDocumentFragment();
  var newFeatureElement;
  for (var i = 0; i < arrFeatures.length; i++) {
    newFeatureElement = document.createElement('li');
    newFeatureElement.className = 'popup__feature popup__feature--' + arrFeatures[i];
    fragmentFeatures.appendChild(newFeatureElement);
  }
  return fragmentFeatures;
};
// список фото
var renderPhotos = function (arrPhotos) {
  var photosContainer = document.createDocumentFragment();
  var templatePhoto = template.content.querySelector('.popup__photo');
  for (var i = 0; i < arrPhotos.length; i++) {
    var photoElement = templatePhoto.cloneNode(true);
    photoElement.src = arrPhotos[i];
    photosContainer.appendChild(photoElement);
  }
  return photosContainer;
};
  })();
