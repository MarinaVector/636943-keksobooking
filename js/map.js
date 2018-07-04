'use strict';
(function () {
  var TITLE_NAMES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

  var PHOTOS_ARR = ['https://o0.github.io/assets/images/tokyo/hotel1.jpg', 'https://o0.github.io/assets/images/tokyo/hotel2.jpg', 'https://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  // создаёт pin
  // массив имен объекта
  var OBJECT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES_SERVICES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  // создаёт объекты
  var createObjects = function (quantity) {
    var objects = [];
    var obj = {};
    // перемешивание массива
    var arrayShuffle = function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[j];
        array[j] = array[i];
        array[i] = temp;
      }
      return array;
    };
    // генерация случайного числа
    var generateRandIndex = function (min, max) {
      var rand = Math.random() * (max - min + 1);
      rand = Math.round(rand);
      return rand;
    };
    // массив для цифр аватара
    var numbersAvatar = [];
    // пустой массив для цифр аватара заполн данными
    for (var j = 0; j < quantity; j++) {
      numbersAvatar[j] = j + 1;
    }
    // перемешаем массив цифр
    arrayShuffle(numbersAvatar);
    // перемеш массив title
    arrayShuffle(TITLE_NAMES);
    for (var i = 0; i < quantity; i++) {
      // пустой объект
      obj = {};
      obj.author = {};
      obj.offer = {};
      obj.location = {};
      if (numbersAvatar[i] <= 9) {
        obj.author.avatar = 'img/avatars/user0' + numbersAvatar[i] + '.png';
      } else {
        obj.author.avatar = 'img/avatars/user' + numbersAvatar[i] + '.png';
      }
      obj.offer.title = TITLE_NAMES[i];
      obj.location.x = generateRandIndex(300, 900);
      obj.location.y = generateRandIndex(130, 630);
      obj.offer.address = obj.location.x + ', ' + obj.location.y;
      obj.offer.price = generateRandIndex(1000, 1000000);
      obj.offer.type = OBJECT_TYPE[generateRandIndex(0, OBJECT_TYPE.length - 1)];
      obj.offer.rooms = generateRandIndex(1, 5);
      obj.offer.guests = generateRandIndex(1, 8);
      obj.offer.checkin = CHECKIN_TIMES[generateRandIndex(0, CHECKIN_TIMES.length - 1)];
      obj.offer.checkout = obj.offer.checkin;
      var NEW_FEATURES_SERVICES = FEATURES_SERVICES.slice();
      arrayShuffle(NEW_FEATURES_SERVICES);
      NEW_FEATURES_SERVICES.length = generateRandIndex(0, NEW_FEATURES_SERVICES.length);
      obj.offer.features = NEW_FEATURES_SERVICES;
      obj.offer.description = '';
      var NEW_PHOHTOS_ARR = PHOTOS_ARR.slice();
      obj.offer.photos = arrayShuffle(NEW_PHOHTOS_ARR);
      objects.push(obj);
    }
    return objects;
  };

  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var adCard = null;
  // ветка 4 новое

  var PIN_WIDTH = 62;
  var PIN_HEIGHT = 84;

  var mapPinMain = map.querySelector('.map__pin--main');
  var pins = map.querySelector('.map__pins');
  var points = {}; // массив объявлений

  var mainPinMouseupHandler = function () {

    map.classList.remove('map--faded'); // убираем неактивный фон
    // отрисовать пины по данным, полученным с сервера
    window.backend.download(onLoadData, onErrorMessage);
    // отрисовываем пины
    window.form.initForm();
    window.form.setAddressValue(parseInt(mapPinMain.style.left, 10) + PIN_WIDTH / 2, parseInt(mapPinMain.style.top, 10) + PIN_HEIGHT);
    mapPinMain.removeEventListener('mouseup', mainPinMouseupHandler);
  };

  var deleteErrorMessage = function () { // удаление сообщения об ошибке
    var body = document.querySelector('body');
    var errorDiv = document.querySelector('.error__message');
    body.removeChild(errorDiv);
  };

  var onLoadData = function (data) {
    points = data;
    renderPage(points);
  };

  var onErrorMessage = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error__message');
    node.style.zIndex = 100;
    node.style.width = '50%';
    node.style.transform = 'translateX(-50%) translateY(-50%)';
    node.style.margin = '0 auto';
    node.style.textAlign = 'center';
    node.style.backgroundColor = '#DC143C';
    node.style.fontWeight = 'bold';
    node.style.position = 'fixed';
    node.style.top = '50%';
    node.style.left = '50%';
    node.style.fontSize = '30px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
    setTimeout(deleteErrorMessage, 3000);
  };
  mapPinMain.addEventListener('mouseup', mainPinMouseupHandler);

  var renderPage = function (points) {
    // рисует pin
    var fragmentPin = document.createDocumentFragment();
    for (var i = 0; i < points.length; i++) {
      fragmentPin.appendChild(window.pin.renderPin(points[i]));
    }
    pins.appendChild(fragmentPin);
    // рисует карточку
    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(window.card.renderCard(points[0]));
    map.insertBefore(fragmentCard, mapFiltersContainer);
    adCard = map.querySelector('article');
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
})();
