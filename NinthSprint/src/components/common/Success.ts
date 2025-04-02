import { Component } from "../base/Component"; // Импорт базового компонента
import { ensureElement } from "../../utils/utils"; // Импорт утилиты для безопасного поиска элементов в DOM

interface ISuccess {
    total: number; // Общее количество для успешного состояния
}

interface ISuccessActions {
    onClick: () => void; // Действие, которое выполняется при клике
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement; // Элемент для закрытия состояния успеха

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container); // Вызов конструктора родительского класса

        // Находит элемент закрытия состояния успеха
        this._close = ensureElement<HTMLElement>('.state__action', this.container);

        // Если передано действие onClick, добавляет обработчик события клика на элемент
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
}
