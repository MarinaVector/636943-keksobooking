'use strict';
(function () {
  // создаёт pin
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

})();
