import { IEvents } from "./events";

// Гарда для проверки на модель
export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model; // Проверяет, является ли объект экземпляром класса Model.
}

/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data); // Копирует данные в экземпляр модели, используя Object.assign.
    }

    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object) {
        // Состав данных можно модифицировать
        this.events.emit(event, payload ?? {}); // Отправляет событие с данными через IEvents.
    }
}
