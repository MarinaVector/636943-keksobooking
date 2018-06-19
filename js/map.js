'use strict';

// тип объекта
var HOUSE_TYPES = {
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  flat: 'Квартира'
};

// массив имен объекта
var TITLE_NAMES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var OBJECT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES_SERVICES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_ARR = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// удаление "поставь меня" + окно левое, иногда убирать:?
// пока снова скроем
//var map = document.querySelector('.map');
//map.classList.remove('map--faded');

// генерация случайного числа
var generateRandIndex = function (min, max) {
  var rand = Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

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

// создаёт объекты
var createObjects = function (quantity) {
  var objects = [];
  var obj = {};

  // с массив для цифр аватара
  var numbersAvatar = [];

  //  пустой массив для цифр аватара заполн данными
  for (var j = 0; j < quantity; j++) {
    numbersAvatar[j] = j + 1;
  }
  // перемеш массив цифр
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

// создаёт pin
var renderPins = function () {
  var pin = templatePin.cloneNode(true);
  var pinWidth = templatePin.offsetWidth;
  var pinHeight = templatePin.offsetHeight;

  pin.style.left = points[i].location.x - pinWidth / 2 + 'px';
  pin.style.top = points[i].location.y - pinHeight + 'px';
  pin.querySelector('img').src = points[i].author.avatar;
  pin.querySelector('img').alt = points[i].offer.title;

  return pin;
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

//  список фото
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

// создаёт карточку с данными
var renderCard = function (renderArr) {
  var card = templateCard.cloneNode(true);

  card.querySelector('.popup__title').textContent = renderArr.offer.title;
  card.querySelector('.popup__text--address').textContent = renderArr.offer.address;
  card.querySelector('.popup__text--price').textContent = renderArr.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = HOUSE_TYPES[renderArr.offer.type];
  card.querySelector('.popup__text--capacity').textContent = renderArr.offer.rooms + ' комнаты для ' + renderArr.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + renderArr.offer.checkin + ', выезд до ' + renderArr.offer.checkout;
  card.querySelector('.popup__features').innerHTML = '';
  card.querySelector('.popup__features').appendChild(renderFeatures(renderArr.offer.features));
  card.querySelector('.popup__description').textContent = renderArr.offer.description;
  card.querySelector('.popup__photos').innerHTML = '';
  card.querySelector('.popup__photos').appendChild(renderPhotos(renderArr.offer.photos));
  card.querySelector('.popup__avatar').src = renderArr.author.avatar;

  return card;
};
// вызывает создателя объектов
var points = createObjects(8);

// находит шаблон
var template = document.querySelector('template');

// элементы pin
var pins = document.querySelector('.map__pins');
var templatePin = template.content.querySelector('.map__pin');

// находит элементы для карточки
var templateCard = template.content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');

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

// ветка 4 pflfybt&
var buttonClick = document.querySelector('.map__pin--main');
var buttonMouseupHandler = function () {
  alert();
};
button.addEventListener('mouseup', buttonMouseupHandler);

var document.getElementById('address');

var setAddress = function (xCoord, yCoord) {
  var addressString = 'x: ' + xCoord + ', ' + 'y: ' + yCoord;

  address.setAttribute('value', addressString);
};
