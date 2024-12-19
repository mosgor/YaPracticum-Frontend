export class FormValidator {
  constructor(validationSettings, form) {
    this._popupInput = validationSettings.inputSelector;
    this._popupSubmit = validationSettings.submitButtonSelector;
    this._popupSubmitDisabled = validationSettings.inactiveButtonClass;
    this._popupInputTypeError = validationSettings.inputErrorClass;
    this._popupErrorVisible = validationSettings.errorClass;
    this._formToValidate = form;
    this._submitButton = this._formToValidate.querySelector(this._popupSubmit);
    this._inputArray = this._formToValidate.querySelectorAll(this._popupInput);
  }


  /** Включает ошибку валидации инпута
   * @param input - валидируемый инпут
   * @param message - сообщение об ошибке
   * @private */
  _showInputError(input, message) {

    const error = this._formToValidate.querySelector(`#${input.id}-error`);

    error.textContent = message;

    input.classList.add(this._popupInputTypeError);
    error.classList.add(this._popupErrorVisible);
  }


  /** Выключает ошибку валидации инпута
   * @param input - валидируемый инпут
   * @private */
  _hideInputError(input) {
    const error = this._formToValidate.querySelector(`#${input.id}-error`);
    error.textContent = "";
    input.classList.remove(this._popupInputTypeError);
    error.classList.remove(this._popupErrorVisible);
  }


  /** Валидация инпута
   * Если инпут не прошел валидацию (?) показывает ошибку, иначе (:) убирает ошибку
   * @param input - элемент формы
   * @private */
  _validateInput(input) {
    !input.validity.valid ? this._showInputError(input, input.validationMessage) : this._hideInputError(input);
  }


  /** Переключает состояние кнопки отправки формы */
  switchSubmitButton() {
    if (Array.from(this._inputArray).filter(input => !input.validity.valid).length === 0) {
      this._submitButton.disabled = false;
      this._submitButton.classList.remove(this._popupSubmitDisabled);
    } else {
      this._submitButton.disabled = true;
      this._submitButton.classList.add(this._popupSubmitDisabled);
    }
  }


  /** Валидирует инпуты, прячет ошибки валидации (при открытии формы) */
  validateInputs() {
    this._inputArray.forEach((input) => {
      this._validateInput(input);
      this._hideInputError(input);
    });
  }


  /** Создание прослушивателей
   * @private */
  _setInputEvtListeners() {
    this._formToValidate.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });

    /** Вешаем прослушиватель input каждому инпуту */
    this._inputArray.forEach((input) => {
      input.addEventListener('input', () => {

        /** Валидация инпута, включает/выключает ошибки */
        this._validateInput(input);

        /** Переключалка состояния кнопки отправки формы */
        this.switchSubmitButton();
      });
    });
  }

  /** Функция включения валидации */
  enableValidation() {
    this._setInputEvtListeners(this._formToValidate);
  }
}
