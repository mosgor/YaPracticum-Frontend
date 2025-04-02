import { Component } from "../base/Component"; // Импорт базового компонента
import { ensureElement } from "../../utils/utils"; // Импорт утилиты для безопасного поиска элементов в DOM
import { IEvents } from "../base/events"; // Импорт интерфейса событий

interface IModalData {
    content: HTMLElement; // Контент модального окна
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement; // Кнопка для закрытия модального окна
    protected _content: HTMLElement; // Элемент для контента модального окна

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); // Вызывает конструктор родительского класса

        // Находит элементы внутри контейнера: кнопку закрытия и контент модального окна
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Добавляет обработчик клика на кнопку для закрытия модального окна
        this._closeButton.addEventListener('click', this.close.bind(this));

        // Добавляет обработчик клика на контейнер модального окна для закрытия при клике вне контента
        this.container.addEventListener('click', this.close.bind(this));

        // Останавливает всплытие события клика, чтобы не закрыть модальное окно при клике внутри контента
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    // Сеттер для установки контента модального окна
    set content(value: HTMLElement) {
        this._content.replaceChildren(value); // Заменяет текущий контент на новый
    }

    // Открыть модальное окно
    open() {
        this.container.classList.add('modal_active'); // Добавляет класс, чтобы сделать модальное окно видимым
        this.events.emit('modal:open'); // Генерирует событие открытия модального окна
    }

    // Закрыть модальное окно
    close() {
        this.container.classList.remove('modal_active'); // Убирает класс, чтобы скрыть модальное окно
        this.content = null; // Очищает контент модального окна
        this.events.emit('modal:close'); // Генерирует событие закрытия модального окна
    }

    // Метод для рендеринга модального окна с переданными данными
    render(data: IModalData): HTMLElement {
        super.render(data); // Вызывает рендер родительского компонента
        this.open(); // Открывает модальное окно после рендера
        return this.container; // Возвращает контейнер модального окна
    }
}
