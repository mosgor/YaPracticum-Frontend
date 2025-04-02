// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp; // Тип для имени события, которое может быть строкой или регулярным выражением.
type Subscriber = Function; // Тип для подписчика, который является функцией.
type EmitterEvent = {
    eventName: string, // Имя события.
    data: unknown // Данные, передаваемые с событием, могут быть любыми.
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void; // Метод для подписки на событие.
    emit<T extends object>(event: string, data?: T): void; // Метод для инициирования события.
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void; // Метод для создания триггера события.
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>; // Хранит события и соответствующие им подписчики.

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>(); // Инициализирует коллекцию событий.
    }

    /**
     * Установить обработчик на событие
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>()); // Создает новый набор подписчиков, если событие не существует.
        }
        this._events.get(eventName)?.add(callback); // Добавляет коллбек для события.
    }

    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback); // Удаляет конкретного подписчика.
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName); // Удаляет событие, если подписчиков больше нет.
            }
        }
    }

    /**
     * Инициировать событие с данными
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name === '*') subscribers.forEach(callback => callback({
                eventName,
                data
            })); // Если событие "*" — вызов для всех подписчиков.
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data)); // Если имя события совпадает с подписанным.
            }
        });
    }

    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback); // Подписывается на все события с именем "*".
    }

    /**
     * Сбросить все обработчики
     */
    offAll() {
        this._events = new Map<string, Set<Subscriber>>(); // Очищает все подписки.
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            }); // Генерирует событие с данными, комбинируя event и context.
        };
    }
}
