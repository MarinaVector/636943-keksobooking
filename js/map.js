'use strict';
(function () {
  var PIN_WIDTH = 62;
  var PIN_HEIGHT = 84;
  var START_MAIN_PIN_LEFT = 570;
  var START_MAIN_PIN_TOP = 375;
  var maxPinsCount = 5;
  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var adCard = null;

  var mapPinMain = map.querySelector('.map__pin--main');
  var pins = map.querySelector('.map__pins');
  var points = {}; // массив объявлений

  var mainPinMouseupHandler = function () {
    map.classList.remove('map--faded'); // убираем неактивный фон
    // отрисовка пинов по данным с сервера
    window.backend.download(onLoadData, window.backend.nErrorMessage);
    // отрисовываем пины
    window.form.initForm();
    window.form.setAddressValue(parseInt(mapPinMain.style.left, 10) + PIN_WIDTH / 2, parseInt(mapPinMain.style.top, 10) + PIN_HEIGHT);
    mapPinMain.removeEventListener('mouseup', mainPinMouseupHandler);
  };

  var onLoadData = function (data) {
    points = data;
    renderPage(points);
  };

  mapPinMain.addEventListener('mouseup', mainPinMouseupHandler);

  var renderPage = function (point) {
    // рисование pin
    var fragmentPin = document.createDocumentFragment();
    if (points.length < maxPinsCount) {
      maxPinsCount = points.length;
    }
    for (var i = 0; i < maxPinsCount; i++) {
      fragmentPin.appendChild(window.pin.renderPin(point[i]));
    }
    pins.appendChild(fragmentPin);
    // рисование карточки
    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(window.card.renderCard(point[0]));
    map.insertBefore(fragmentCard, mapFiltersContainer);
    adCard = map.querySelector('article');
    if (adCard === null) {
      fragmentCard.appendChild(window.card.renderCard(point[0]));
      map.insertBefore(fragmentCard, mapFiltersContainer);
      adCard = map.querySelector('article');
    }
    adCard.classList.add('hidden');
    var closeButton = adCard.querySelector('.popup__close');
    closeButton.addEventListener('click', window.card.closeClickHandler);

  };

  // перетаскивание
  var onMapPinMainMouseDown = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var onMapPinMainMove = function (moveEvt) {
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.x,
        y: moveEvt.y
      };
      var mapWidth = map.offsetWidth;
      var minTop = 130;
      var maxTop = 630;
      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      if ((mapPinMain.offsetLeft - shift.x) > (mapWidth - mapPinMain.offsetWidth)) {
        mapPinMain.style.left = mapWidth - mapPinMain.offsetWidth + 'px';
      }
      if ((mapPinMain.offsetLeft - shift.x) < (mapWidth - mapWidth)) {
        mapPinMain.style.left = (mapWidth - mapWidth) + 'px';
      }
      if ((mapPinMain.offsetTop - shift.y) < (minTop - mapPinMain.offsetHeight)) {
        mapPinMain.style.top = (minTop - mapPinMain.offsetHeight) + 'px';
      }
      if ((mapPinMain.offsetTop - shift.y) > maxTop) {
        mapPinMain.style.top = maxTop + 'px';
      }
      window.form.setAddressValue(parseInt(mapPinMain.style.left, 10) + PIN_WIDTH / 2, parseInt(mapPinMain.style.top, 10) + PIN_HEIGHT);
    };
    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMapPinMainMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMapPinMainMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
  var removeAllPins = function () {
    var allPins = document.querySelectorAll('.map__pin'); // нашли все пины

    for (var j = 0; j < allPins.length; j++) {
      if (!allPins[j].classList.contains('map__pin--main')) {
        pins.removeChild(allPins[j]);
      }
    }
  };

  var makePageInactive = function () {
    map.classList.add('map--faded'); // скрывающий класс
    mapPinMain.addEventListener('mouseup', mainPinMouseupHandler);
    window.card.closeClickHandler(); // закрываем карточку
    removeAllPins(); //  удаляем все пины
    mapPinMain.style.left = START_MAIN_PIN_LEFT + 'px';
    mapPinMain.style.top = START_MAIN_PIN_TOP + 'px'; // возврат главного пина в первоначальное положение
    window.form.clearForm();
    window.form.disableForm();
    window.form.setAddressValue(parseInt(mapPinMain.style.left, 10) + PIN_WIDTH / 2, parseInt(mapPinMain.style.top, 10) + PIN_HEIGHT); // установка адреса
  };
  window.map = {
    makePageInactive: makePageInactive
  };
})();
