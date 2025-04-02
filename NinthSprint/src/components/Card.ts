import { Component } from "./base/Component"; // Импорт базового компонента
import { ILot, LotStatus } from "../types"; // Импорт типов лота и статуса лота
import { bem, createElement, ensureElement, formatNumber } from "../utils/utils"; // Утилиты для работы с BEM, создания элементов и форматирования
import clsx from "clsx"; // Утилита для работы с классами

interface ICardActions {
    onClick: (event: MouseEvent) => void; // Действие при клике на карточку
}

export interface ICard<T> {
    title: string; // Заголовок карточки
    description?: string | string[]; // Описание карточки (может быть строкой или массивом строк)
    image: string; // Изображение карточки
    status: T; // Статус карточки
}

// Класс, представляющий базовую карточку
export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement; // Элемент заголовка карточки
    protected _image?: HTMLImageElement; // Элемент изображения карточки
    protected _description?: HTMLElement; // Элемент описания карточки
    protected _button?: HTMLButtonElement; // Кнопка на карточке

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container); // Вызов конструктора базового компонента

        // Инициализация элементов карточки
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);

        // Если передано действие onClick, добавляется обработчик клика на карточку
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // Сеттер и геттер для id карточки
    set id(value: string) {
        this.container.dataset.id = value;
    }
    get id(): string {
        return this.container.dataset.id || '';
    }

    // Сеттер и геттер для title карточки
    set title(value: string) {
        this.setText(this._title, value);
    }
    get title(): string {
        return this._title.textContent || '';
    }

    // Сеттер для изображения карточки
    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    // Сеттер для описания карточки
    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }
}

export type CatalogItemStatus = {
    status: LotStatus; // Статус лота
    label: string; // Мета-метка для статуса
};

// Класс для карточки лота в каталоге
export class CatalogItem extends Card<CatalogItemStatus> {
    protected _status: HTMLElement; // Элемент статуса лота

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions); // Вызывает конструктор родительского класса
        this._status = ensureElement<HTMLElement>(`.card__status`, container);
    }

    // Сеттер для статуса лота
    set status({ status, label }: CatalogItemStatus) {
        this.setText(this._status, label); // Обновление текста статуса
        this._status.className = clsx('card__status', {
            [bem(this.blockName, 'status', 'active').name]: status === 'active',
            [bem(this.blockName, 'status', 'closed').name]: status === 'closed'
        });
    }
}

export type AuctionStatus = {
    status: string; // Статус аукциона
    time: string; // Время аукциона
    label: string; // Мета-метка для статуса аукциона
    nextBid: number; // Следующая возможная ставка
    history: number[]; // История ставок
};

// Класс для карточки аукциона
export class AuctionItem extends Card<HTMLElement> {
    protected _status: HTMLElement; // Элемент статуса аукциона

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('lot', container, actions); // Вызывает конструктор родительского класса
        this._status = ensureElement<HTMLElement>(`.lot__status`, container);
    }

    // Сеттер для статуса аукциона
    set status(content: HTMLElement) {
        this._status.replaceWith(content); // Заменяет статус контентом
    }
}

interface IAuctionActions {
    onSubmit: (price: number) => void; // Действие при отправке ставки
}

// Класс для аукциона, включая ставки и историю
export class Auction extends Component<AuctionStatus> {
    protected _time: HTMLElement; // Элемент времени аукциона
    protected _label: HTMLElement; // Элемент метки статуса аукциона
    protected _button: HTMLButtonElement; // Кнопка для размещения ставки
    protected _input: HTMLInputElement; // Поле для ввода ставки
    protected _history: HTMLElement; // Элемент истории ставок
    protected _bids: HTMLElement; // Элемент для отображения списка ставок
    protected _form: HTMLFormElement; // Форма для отправки ставки

    constructor(container: HTMLElement, actions?: IAuctionActions) {
        super(container); // Вызывает конструктор базового компонента

        // Инициализация всех элементов на странице
        this._time = ensureElement<HTMLElement>(`.lot__auction-timer`, container);
        this._label = ensureElement<HTMLElement>(`.lot__auction-text`, container);
        this._button = ensureElement<HTMLButtonElement>(`.button`, container);
        this._input = ensureElement<HTMLInputElement>(`.form__input`, container);
        this._bids = ensureElement<HTMLElement>(`.lot__history-bids`, container);
        this._history = ensureElement<HTMLElement>('.lot__history', container);
        this._form = ensureElement<HTMLFormElement>(`.lot__bid`, container);

        // Обработчик события при отправке ставки
        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            actions?.onSubmit?.(parseInt(this._input.value)); // Отправляет ставку
            return false;
        });
    }

    // Сеттеры для различных данных
    set time(value: string) {
        this.setText(this._time, value);
    }
    set label(value: string) {
        this.setText(this._label, value);
    }
    set nextBid(value: number) {
        this._input.value = String(value); // Устанавливает значение следующей ставки
    }
    set history(value: number[]) {
        this._bids.replaceChildren(...value.map(item => createElement<HTMLUListElement>('li', {
            className: 'lot__history-item',
            textContent: formatNumber(item) // Отображает каждую ставку в истории
        })));
    }

    // Сеттер для статуса лота
    set status(value: LotStatus) {
        if (value !== 'active') {
            this.setHidden(this._history);
            this.setHidden(this._form);
        } else {
            this.setVisible(this._history);
            this.setVisible(this._form);
        }
    }

    // Метод для фокусировки на поле ввода ставки
    focus() {
        this._input.focus();
    }
}

export interface BidStatus {
    amount: number; // Сумма ставки
    status: boolean; // Статус ставки (активна/неактивна)
}

// Класс для отображения ставки на аукционе
export class BidItem extends Card<BidStatus> {
    protected _amount: HTMLElement; // Элемент для отображения суммы ставки
    protected _status: HTMLElement; // Элемент для отображения статуса ставки
    protected _selector: HTMLInputElement; // Элемент для выбора ставки

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('bid', container, actions); // Вызывает конструктор родительского компонента
        this._amount = ensureElement<HTMLElement>(`.bid__amount`, container);
        this._status = ensureElement<HTMLElement>(`.bid__status`, container);
        this._selector = container.querySelector(`.bid__selector-input`);

        // Обработчик изменения ставки
        if (!this._button && this._selector) {
            this._selector.addEventListener('change', (event: MouseEvent) => {
                actions?.onClick?.(event); // Выполняет действие при изменении ставки
            });
        }
    }

    // Сеттер для отображения ставки
    set status({ amount, status }: BidStatus) {
        this.setText(this._amount, formatNumber(amount)); // Форматирует сумму ставки

        if (status) this.setVisible(this._status);
        else this.setHidden(this._status);
    }
}
