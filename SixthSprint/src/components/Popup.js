/** Открывает и закрывает всплывашки*/
export class Popup {

  /** Конструктор всплывашки
   * @param popupSelector - селектор всплывашки */
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
    this._handleEsc = (evt) => {
      this._handleEscClose(evt);
    }
  }

  /** Открывает всплывашку, добавяет прослушиватель нажатия на ESC */
  open() {
    this._popup.classList.add('popup_opened');
    document.addEventListener('keydown', this._handleEsc);
  }

  /** Закрывает всплывашку, удаляет прослушиватель нажатия на ESC */
  close() {
    this._popup.classList.remove('popup_opened');
    document.removeEventListener('keydown', this._handleEsc);
  }

  /** Закрывает всплывашку по нажатию ESC
   * @private */
  _handleEscClose(evt) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  /** Добавляет прослушиватель нажатия на оверлей или кнопку закрытия */
  setEventListeners() {
    this._popup.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('popup_opened') || evt.target.classList.contains('popup__close-button')) {
        this.close();
      }
    });
  }

}

