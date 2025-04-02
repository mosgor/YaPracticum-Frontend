import { Component } from "./base/Component"; // Импорт базового компонента
import { IEvents } from "./base/events"; // Импорт интерфейса событий
import { ensureElement } from "../utils/utils"; // Утилита для безопасного поиска элементов

// Интерфейс состояния страницы
interface IPage {
    counter: number; // Счетчик для корзины
    catalog: HTMLElement[]; // Массив элементов каталога
    locked: boolean; // Статус блокировки страницы
}

// Класс страницы, который управляет состоянием корзины, каталога и блокировки
export class Page extends Component<IPage> {
    protected _counter: HTMLElement; // Элемент счетчика корзины
    protected _catalog: HTMLElement; // Элемент каталога
    protected _wrapper: HTMLElement; // Обертка для страницы
    protected _basket: HTMLElement; // Элемент корзины

    // Конструктор, инициализирует элементы страницы и добавляет обработчик клика по корзине
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); // Вызов конструктора родительского класса

        // Инициализация элементов страницы
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.catalog__items');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        // Обработчик клика по корзине
        this._basket.addEventListener('click', () => {
            this.events.emit('bids:open'); // Генерация события открытия корзины
        });
    }

    // Сеттер для обновления счетчика корзины
    set counter(value: number) {
        this.setText(this._counter, String(value)); // Устанавливает новое значение в элемент счетчика
    }

    // Сеттер для обновления элементов каталога
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items); // Заменяет содержимое каталога на новые элементы
    }

    // Сеттер для блокировки страницы
    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked'); // Добавляет класс блокировки
        } else {
            this._wrapper.classList.remove('page__wrapper_locked'); // Убирает класс блокировки
        }
    }
}
