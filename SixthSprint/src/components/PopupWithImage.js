import {Popup} from './Popup.js';

/** Открывает и закрывает всплывашку с изображением */
export class PopupWithImage extends Popup{

  /** Конструктор всплывашки с изображением
   * @param popupSelector - селектор всплывашки */
  constructor(popupSelector){
    super(popupSelector)
    this._image = this._popup.querySelector('.popup__image');
    this._caption = this._popup.querySelector('.popup__caption');
  }

  /** Открывает всплывашку, вставляет картинку и название картинки
   * @param title - название
   * @param src - ссылка на изображение */
  open({title, src}){
    this._image.src = src;
    this._image.alt = title;
    this._caption.textContent = title;
    super.open();
  }
}
