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
  var onMapPinMainMove = function (moveEvt) {
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };
    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMapPinMainMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMapPinMainMove);
    document.addEventListener('mouseup', onMouseUp);
    mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
    var mainPin = document.querySelector('.map__pin--main');
    // карточка отработка раньше
    var adCard = null;
    var closeButton = null;
    var renderPage = function (points) {
      // рисует pin
      var fragmentPin = document.createDocumentFragment();
      for (var i = 0; i < points.length; i++) {
        fragmentPin.appendChild(renderPins(points[i]));
      }
      pins.appendChild(fragmentPin);
      // рисует карточку
      var fragmentCard = document.createDocumentFragment();
      fragmentCard.appendChild(renderCard(points[0]));
      map.insertBefore(fragmentCard, mapFiltersContainer);
      adCard = map.querySelector('article');
      adCard.classList.add('hidden');
      closeButton = adCard.querySelector('.popup__close');
      closeButton.addEventListener('click', closeClickHandler);
    };
    var mainPinMouseupHandler = function () {
      map.classList.remove('map--faded'); // убираем неактивный фон
      renderPage(points);
      // отрисовываем пины
      removeFormDisabled();
      setAddress(parseInt(mainPin.style.left, 10) + PIN_WIDTH / 2, parseInt(mainPin.style.top, 10) + PIN_HEIGHT);
      mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    };
    // создаёт карточку с данными
    var renderCard = function (renderArr) {
      var card = templateCard.cloneNode(true);
      card.querySelector('.popup__title').textContent = renderArr.offer.title;
      card.querySelector('.popup__text--address').textContent = renderArr.offer.address;
      card.querySelector('.popup__text--price').textContent = renderArr.offer.price + '₽/ночь';
      card.querySelector('.popup__type').textContent = HOUSE_TYPES[renderArr.offer.type];
      card.querySelector('.popup__text--capacity').textContent = renderArr.offer.rooms + ' комнаты для ' + renderArr.offer.guests + ' гостей';
      card.querySelector('.popup__text--time').textContent = 'Заезд после ' + renderArr.offer.checkin + ', выезд до ' + renderArr.offer.checkout;
      card.querySelector('.popup__features').textContent = '';
      card.querySelector('.popup__features').appendChild(renderFeatures(renderArr.offer.features));
      card.querySelector('.popup__description').textContent = renderArr.offer.description;
      card.querySelector('.popup__photos').textContent = '';
      card.querySelector('.popup__photos').appendChild(renderPhotos(renderArr.offer.photos));
      card.querySelector('.popup__avatar').src = renderArr.author.avatar;
      return card;
    };
    var fillCard = function (ad) {
      adCard.querySelector('.popup__title').textContent = ad.offer.title;
      adCard.querySelector('.popup__text--address').textContent = ad.offer.address;
      adCard.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
      adCard.querySelector('.popup__type').textContent = HOUSE_TYPES[ad.offer.type];
      adCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
      adCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
      adCard.querySelector('.popup__features').textContent = '';
      adCard.querySelector('.popup__features').appendChild(renderFeatures(ad.offer.features));
      adCard.querySelector('.popup__description').textContent = ad.offer.description;
      adCard.querySelector('.popup__photos').textContent = '';
      adCard.querySelector('.popup__photos').appendChild(renderPhotos(ad.offer.photos));
      adCard.querySelector('.popup__avatar').src = ad.author.avatar;
      adCard.classList.remove('hidden');
      return adCard;
    };
  };
})();
