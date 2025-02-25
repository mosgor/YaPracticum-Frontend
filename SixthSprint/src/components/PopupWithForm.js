import {Popup} from './Popup.js'

/** Открывает и закрывает всплывашку с формой */
export class PopupWithForm extends Popup {

  /** Конструктор всплывашки с формой
   * @param popupSelector - селектор всплывашки
   * @param handleSubmitForm - обработчик отправки формы */
  constructor(popupSelector, {handleSubmitForm}) {
    super(popupSelector);
    this._handleSubmitForm = handleSubmitForm;
    this._form = this._popup.querySelector('.popup__form');
    this._inputList = this._form.querySelectorAll('.popup__input');
    this._submitbutton = this._popup.querySelector('.popup__submit');
  }

  /** Получает значения инпутов формы всплывашки
   * @returns {*|{}} - объект с названиями инпутов и их значениями: {название: значение}
   * @private */
  _getInputValues() {
    this._formValues = {};
    this._inputList.forEach((input) => {
      this._formValues[input.name] = input.value;
    });
    return this._formValues;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener('submit', () => {
      this.renderLoading(true);
      this._handleSubmitForm(this._getInputValues());
    });
  }

  close() {
    super.close();
    this._form.reset();
  }

  renderLoading(isLoading) {
    if (isLoading) {
      this._submitbutton.textContent = 'Сохранение...';
    } else {
      this._submitbutton.textContent = this._submitbutton.dataset.value;
    }
  }

}

