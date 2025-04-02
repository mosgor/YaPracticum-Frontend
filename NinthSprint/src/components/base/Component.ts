import { IEvents } from "./events"; // Импортирует интерфейс IEvents для использования событий, но он не используется в этом фрагменте кода.

 /**
  * Базовый компонент
  */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        // Конструктор компонента принимает контейнер (DOM-элемент), в котором будет рендериться компонент.
        // Обратите внимание, что код в конструкторе исполняется ДО всех объявлений в дочернем классе.
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        // Метод для добавления или удаления класса у элемента в зависимости от параметра force (если он задан).
        element.classList.toggle(className, force);
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        // Метод для установки текстового содержимого в элемент. Значение приводится к строке.
        if (element) {
            element.textContent = String(value);
        }
    }

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean) {
        // Метод для изменения состояния элемента на "заблокирован" или "разблокирован".
        // Если state = true, устанавливается атрибут 'disabled', если false, атрибут удаляется.
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Скрыть элемент
    protected setHidden(element: HTMLElement) {
        // Метод для скрытия элемента путем изменения стиля display на 'none'.
        element.style.display = 'none';
    }

    // Показать элемент
    protected setVisible(element: HTMLElement) {
        // Метод для отображения скрытого элемента, удаляя стиль display.
        element.style.removeProperty('display');
    }

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        // Метод для установки изображения и альтернативного текста для элемента img.
        // Если параметр alt предоставлен, он также устанавливается для изображения.
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        // Метод для рендеринга компонента. Он выполняет назначение данных в компонент, если они предоставлены.
        // Данные объединяются с объектом компонента, и возвращается контейнер.
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
