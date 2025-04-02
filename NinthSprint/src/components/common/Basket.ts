import { Component } from "../base/Component"; // Импорт базового компонента
import { cloneTemplate, createElement, ensureElement, formatNumber } from "../../utils/utils"; // Импорт вспомогательных утилит
import { EventEmitter } from "../base/events"; // Импорт события-эмиттера

interface IBasketView {
    items: HTMLElement[]; // Массив элементов корзины
    total: number; // Общая стоимость товаров в корзине
    selected: string[]; // Массив выбранных товаров
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement; // Элемент, представляющий список товаров
    protected _total: HTMLElement; // Элемент для отображения общей стоимости
    protected _button: HTMLElement; // Кнопка для совершения заказа

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container); // Вызывает конструктор базового компонента, передавая контейнер

        // Находит необходимые элементы внутри контейнера
        this._list = ensureElement<HTMLElement>('.basket__list', this.container); 
        this._total = this.container.querySelector('.basket__total');
        this._button = this.container.querySelector('.basket__action');

        // Добавляет обработчик клика на кнопку, который инициирует событие заказа
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open'); // Генерирует событие "order:open" через EventEmitter
            });
        }

        this.items = []; // Инициализация пустого списка товаров
    }

    // Геттер и сеттер для items
    set items(items: HTMLElement[]) {
        // Если есть товары, заменяет их в списке
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            // Если корзина пуста, отображается текст "Корзина пуста"
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    // Геттер и сеттер для selected
    set selected(items: string[]) {
        // Включает или отключает кнопку в зависимости от наличия выбранных товаров
        if (items.length) {
            this.setDisabled(this._button, false); // Разблокирует кнопку
        } else {
            this.setDisabled(this._button, true); // Блокирует кнопку
        }
    }

    // Геттер и сеттер для total
    set total(total: number) {
        this.setText(this._total, formatNumber(total)); // Форматирует и отображает общую стоимость
    }
}
