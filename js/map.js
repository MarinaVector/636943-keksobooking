'use strict';
// тип объектов
var ESC_KEY = 27;
var HOUSE_TYPES = {
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  flat: 'Квартира'
};
// массив имен объекта
var TITLE_NAMES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OBJECT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES_SERVICES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_ARR = ['https://o0.github.io/assets/images/tokyo/hotel1.jpg', 'https://o0.github.io/assets/images/tokyo/hotel2.jpg', 'https://o0.github.io/assets/images/tokyo/hotel3.jpg'];
// удаление "поставь меня" + окно левое, иногда убирать:?
// пока снова скроем
var map = document.querySelector('.map');
var activePin = null;
// map.classList.remove('map--faded');
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
  // пустой массив для цифр аватара заполн данными
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
  adCard.addEventListener('click', renderCard);
  closeButton = adCard.querySelector('.popup__close');
  closeButton.addEventListener('click', closeClickHandler);

};

// создаёт pin
var renderPins = function (point) {
  var pin = templatePin.cloneNode(true);
  var pinWidth = templatePin.offsetWidth;
  var pinHeight = templatePin.offsetHeight;
  pin.style.left = point.location.x - pinWidth / 2 + 'px';
  pin.style.top = point.location.y - pinHeight +
    'px';
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
// вызывает создателя объектов
var points = createObjects(8);
// находит шаблон
var template = document.querySelector('template');
// элементы pin
var pins =
  document.querySelector('.map__pins');
var templatePin = template.content.querySelector('.map__pin');
// находит элементы для карточки
var templateCard = template.content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');
// ветка 4 новое
var form = document.querySelector('.ad-form');
var mainPin = document.querySelector('.map__pin--main');
var formFieldset = form.querySelectorAll('fieldset');
var removeFormDisabled = function () { // отменяет неактивное состояние формы
  for (var i = 0; i < formFieldset.length; i++) {
    formFieldset[i].disabled = '';
  }
  form.classList.remove('ad-form--disabled');
};
var mainPinMouseupHandler = function () {
  map.classList.remove('map--faded'); // убираем неактивный фон
  renderPage(points);
  // отрисовываем пины
  removeFormDisabled();
  mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
};
mainPin.addEventListener('mouseup', mainPinMouseupHandler);
// Выбор адреса координат

// координаты кончика пина - к x прибавить половину ширины пина, а к y добавить его высоту
var PIN_WIDTH = 62;
var PIN_HEIGHT = 84;

// находим поле address
var address = form.querySelector('#address');
// пишем функцию
var setAddress = function (xCoord, yCoord) {
  var addresString = 'x: ' + xCoord + ', ' + 'y: ' + yCoord;
  address.value = addresString;
};
// вызовем ее, чтобы заполнить поле адрес
setAddress(parseInt(mainPin.style.left, 10) + PIN_WIDTH / 2, parseInt(mainPin.style.top, 10) + PIN_HEIGHT);

// форма отправки
var adForm = document.querySelector('.ad-form');

var inputRooms = adForm.querySelector('select_room_number');
var inputGuests = adForm.querySelector('select_capacity');
var inputType = adForm.querySelector('select_type');
var inputTimeIn = adForm.querySelector('select_timein');
var inputTimeOut = adForm.querySelector('select_timeout');

// проверка полей комнат и гостей при изменении поля с гостями
var onInputGuestsChange = function () {
  if (inputRooms.value === '100' && inputGuests.value !== '0') {
    inputGuests.setCustomValidity('Количество гостей не бывает больше чем комнат. Только "100 комнат" для "не для гостей"');
  } else if (inputRooms.value !== '100' && (inputRooms.value < inputGuests.value || inputGuests.value < 1)) {
    inputGuests.setCustomValidity('Количествово гостей не бывает больше чем комнат. Только "100 комнат" для "не для гостей"');
  } else {
    inputGuests.setCustomValidity('');
  }
};


// проверка полей комнат и гостей при изменении поля с комнатами
var onInputRoomsChange = function () {
  if (inputRooms.value === '100' && inputGuests.value !== '0') {
    inputGuests.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат. Только "100 комнат" для "не для гостей"');
  } else if (inputRooms.value !== '100' && (inputRooms.value < inputGuests.value || inputGuests.value < 1)) {
    inputGuests.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат. Только "100 комнат" для "не для гостей"');
  } else {
    inputGuests.setCustomValidity('');
  }
};


// установка минимальных цен в зависимости от типа дома
var onInputTypeChange = function () {
  var inpputPrice = adForm.querySelector('input_price');

  if (inputType.value === 'flat') {
    inpputPrice.min = 500;
    inpputPrice.placeholder = 500;
  } else if (inputType.value === 'house') {
    inpputPrice.min = 3000;
    inpputPrice.placeholder = 3000;
  } else if (inputType.value === 'palace') {
    inpputPrice.min = 10000;
    inpputPrice.placeholder = 10000;
  }
};

// синхронизация времени заезда и выезда
var onInputTimeInChange = function () {
  inputTimeOut.value = inputTimeIn.value;
};


var onInputTimeOutChange = function () {
  inputTimeIn.value = inputTimeOut.value;
};
inputTimeOut.addEventListener('change', onInputTimeOutChange);
inputGuests.addEventListener('change', onInputGuestsChange);
inputRooms.addEventListener('change', onInputRoomsChange);
inputType.addEventListener('change', onInputTypeChange);
inputTimeIn.addEventListener('change', onInputTimeInChange);
