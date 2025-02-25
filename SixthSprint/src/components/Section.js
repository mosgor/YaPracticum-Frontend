/** Отрисовщик элементов страницы */
export class Section {

  /** Конструктор элемента
   * @param items - массив данных, добавляемых на страницу при инициализации класса
   * @param renderer - ф-я создающая и орисовывающая данные
   * @param containerSelector - селектор контейнера, в который добавляются созданные элементы
   */
  constructor({renderer}, containerSelector) {
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  /** Добавляет элемент в конец контейнера
   * @param element - добавляемый DOM-элемент */
  addItem(element){
    this._container.append(element);
  }

  /** Добавляет созданный элемент в начало контейнера
   * @param element - добавляемый DOM-элемент */
  addNewItem(element){
    this._container.prepend(element);
  }

  /** Отрисовывает элементы (вначале очищает содержимое контейнера) */
  renderElements(items){
    this._container.innerHTML = '';
    items.forEach((element) => {
      this._renderer(element);
    });
  }

}
