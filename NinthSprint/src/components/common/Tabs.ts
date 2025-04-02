import { Component } from "../base/Component"; // Импорт базового компонента
import { ensureAllElements } from "../../utils/utils"; // Импорт утилиты для безопасного поиска всех элементов в DOM

export type TabState = {
    selected: string; // Имя выбранной вкладки
};

export type TabActions = {
    onClick: (tab: string) => void; // Действие при клике на вкладку
};

export class Tabs extends Component<TabState> {
    protected _buttons: HTMLButtonElement[]; // Массив кнопок, представляющих вкладки

    constructor(container: HTMLElement, actions?: TabActions) {
        super(container); // Вызов конструктора родительского класса

        // Находит все элементы кнопок внутри контейнера
        this._buttons = ensureAllElements<HTMLButtonElement>('.button', container);

        // Добавляет обработчик события клика на каждую кнопку
        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                actions?.onClick?.(button.name); // Если передано действие onClick, выполняет его с именем вкладки
            });
        });
    }

    // Сеттер для установки выбранной вкладки
    set selected(name: string) {
        this._buttons.forEach(button => {
            // Добавляет или удаляет активный класс и блокирует/разблокирует кнопку в зависимости от выбранной вкладки
            this.toggleClass(button, 'tabs__item_active', button.name === name);
            this.setDisabled(button, button.name === name);
        });
    }
}
