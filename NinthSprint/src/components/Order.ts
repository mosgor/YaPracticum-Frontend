import { Form } from "./common/Form"; // Импорт базового класса для формы
import { IOrderForm } from "../types"; // Импорт интерфейса для формы заказа
import { EventEmitter, IEvents } from "./base/events"; // Импорт событий
import { ensureElement } from "../utils/utils"; // Утилита для безопасного поиска элементов

// Класс для создания и управления формой заказа
export class Order extends Form<IOrderForm> {
    // Конструктор, принимающий контейнер формы и обработку событий
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // Вызывает конструктор родительского класса
    }

    // Сеттер для установки значения телефона в форме
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value; // Устанавливает значение в поле с именем 'phone'
    }

    // Сеттер для установки значения email в форме
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value; // Устанавливает значение в поле с именем 'email'
    }
}
