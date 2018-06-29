'use strict';
(function () {
  // пока скроем
var map = document.querySelector('.map');
var activePin = null;
// map.classList.remove('map--faded');
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
})();
