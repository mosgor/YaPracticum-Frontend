import { Component } from "../base/Component"; // Импорт базового компонента
import { IEvents } from "../base/events"; // Импорт интерфейса событий
import { ensureElement } from "../../utils/utils"; // Импорт утилиты для безопасного поиска элементов в DOM

interface IFormState {
    valid: boolean; // Флаг валидности формы
    errors: string[]; // Массив ошибок формы
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement; // Кнопка отправки формы
    protected _errors: HTMLElement; // Элемент для отображения ошибок

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container); // Вызов конструктора родительского класса

        // Ищет элементы внутри формы: кнопку отправки и блок ошибок
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Обработчик события ввода в форме (например, изменение значения в поле)
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement; // Получаем целевой элемент
            const field = target.name as keyof T; // Извлекаем имя поля
            const value = target.value; // Значение поля
            this.onInputChange(field, value); // Вызываем метод для обработки изменений
        });

        // Обработчик события отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault(); // Отменяем стандартное поведение формы
            this.events.emit(`${this.container.name}:submit`); // Генерируем событие отправки
        });
    }

    // Метод для обработки изменения значений полей формы
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, { // Генерация события изменения поля
            field,
            value
        });
    }

    // Сеттер для валидности формы
    set valid(value: boolean) {
        this._submit.disabled = !value; // Включение/выключение кнопки отправки формы в зависимости от валидности
    }

    // Сеттер для ошибок формы
    set errors(value: string) {
        this.setText(this._errors, value); // Устанавливает текст ошибок в соответствующий элемент
    }

    // Метод для рендеринга формы, принимающий частичное состояние формы
    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state; // Разделяет данные на валидность, ошибки и поля формы
        super.render({ valid, errors }); // Вызывает рендер родительского компонента
        Object.assign(this, inputs); // Обновляет состояние полей формы
        return this.container; // Возвращает контейнер формы
    }
}
