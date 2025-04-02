import dayjs from 'dayjs'; // Импорт библиотеки dayjs для работы с датами
import 'dayjs/locale/ru'; // Локализация для русского языка
import calendar from 'dayjs/plugin/calendar'; // Плагин для календаря
import duration from 'dayjs/plugin/duration'; // Плагин для продолжительности
import relativeTime from 'dayjs/plugin/relativeTime'; // Плагин для относительного времени

// Устанавливаем локаль на русский
dayjs.locale('ru');
// Расширяем dayjs с помощью плагинов
dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(relativeTime);

export {
    dayjs
};

// Функция для преобразования строки из PascalCase в kebab-case
export function pascalToKebab(value: string): string {
    return value.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase(); // Преобразует заглавные буквы в маленькие с дефисами
}

// Проверка, является ли значение строкой (селектором)
export function isSelector(x: any): x is string {
    return (typeof x === "string") && x.length > 1; // Проверяет, что x - это строка длиной больше 1
}

// Проверка на пустое значение
export function isEmpty(value: any): boolean {
    return value === null || value === undefined; // Проверяет, что значение пустое или не определено
}

// Функция для капитализации первого символа строки
export function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1); // Преобразует первую букву в верхний регистр
}

// Форматирование числа с разделителями для тысяч
export function formatNumber(x: number, sep = ' ') {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep); // Добавляет разделитель тысяч в число
}

// Тип для коллекции селекторов
export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

// Функция для безопасного получения всех элементов на странице, соответствующих селектору
export function ensureAllElements<T extends HTMLElement>(selectorElement: SelectorCollection<T>, context: HTMLElement = document as unknown as HTMLElement): T[] {
    if (isSelector(selectorElement)) {
        return Array.from(context.querySelectorAll(selectorElement)) as T[]; // Если это строка-селектор, возвращаем элементы
    }
    if (selectorElement instanceof NodeList) {
        return Array.from(selectorElement) as T[]; // Если это NodeList, преобразуем в массив
    }
    if (Array.isArray(selectorElement)) {
        return selectorElement; // Если это массив, возвращаем как есть
    }
    throw new Error(`Unknown selector element`); // Если тип неизвестен, выбрасываем ошибку
}

// Тип для селектора элемента
export type SelectorElement<T> = T | string;

// Функция для получения одного элемента по селектору
export function ensureElement<T extends HTMLElement>(selectorElement: SelectorElement<T>, context?: HTMLElement): T {
    if (isSelector(selectorElement)) {
        const elements = ensureAllElements<T>(selectorElement, context);
        if (elements.length > 1) {
            console.warn(`selector ${selectorElement} return more than one element`); // Предупреждение, если найдено несколько элементов
        }
        if (elements.length === 0) {
            throw new Error(`selector ${selectorElement} return nothing`); // Ошибка, если элемент не найден
        }
        return elements.pop() as T; // Возвращаем первый найденный элемент
    }
    if (selectorElement instanceof HTMLElement) {
        return selectorElement as T; // Если это уже элемент, возвращаем его
    }
    throw new Error('Unknown selector element'); // Ошибка, если тип неизвестен
}

// Функция для клонирования шаблона
export function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T {
    const template = ensureElement(query) as HTMLTemplateElement; // Находим шаблон
    return template.content.firstElementChild.cloneNode(true) as T; // Клонируем и возвращаем первый дочерний элемент
}

// Функция для генерации BEM-имени
export function bem(block: string, element?: string, modifier?: string): { name: string, class: string } {
    let name = block;
    if (element) name += `__${element}`;
    if (modifier) name += `_${modifier}`;
    return {
        name,
        class: `.${name}` // Возвращаем имя и класс для использования в стиле
    };
}

// Функция для получения всех свойств объекта с возможностью фильтрации
export function getObjectProperties(obj: object, filter?: (name: string, prop: PropertyDescriptor) => boolean): string[] {
    return Object.entries(
        Object.getOwnPropertyDescriptors(
            Object.getPrototypeOf(obj) // Получаем дескрипторы свойств прототипа объекта
        )
    )
        .filter(([name, prop]: [string, PropertyDescriptor]) => filter ? filter(name, prop) : (name !== 'constructor')) // Фильтруем по имени и свойствам
        .map(([name, prop]) => name); // Возвращаем только имена свойств
}

/**
 * Устанавливает dataset атрибуты элемента
 */
export function setElementData<T extends Record<string, unknown> | object>(el: HTMLElement, data: T) {
    for (const key in data) {
        el.dataset[key] = String(data[key]); // Устанавливаем значение в dataset элемента
    }
}

/**
 * Получает типизированные данные из dataset атрибутов элемента
 */
export function getElementData<T extends Record<string, unknown>>(el: HTMLElement, scheme: Record<string, Function>): T {
    const data: Partial<T> = {};
    for (const key in el.dataset) {
        data[key as keyof T] = scheme[key](el.dataset[key]); // Преобразуем значения в типы, используя схему
    }
    return data as T;
}

/**
 * Проверка на простой объект
 */
export function isPlainObject(obj: unknown): obj is object {
    const prototype = Object.getPrototypeOf(obj);
    return  prototype === Object.getPrototypeOf({}) ||
        prototype === null; // Проверка, что объект является простым объектом
}

// Проверка на булевое значение
export function isBoolean(v: unknown): v is boolean {
    return typeof v === 'boolean';
}

/**
 * Фабрика DOM-элементов в простейшей реализации
 * здесь не учтено много факторов
 * в интернет можно найти более полные реализации
 */
export function createElement<
    T extends HTMLElement
    >(
    tagName: keyof HTMLElementTagNameMap,
    props?: Partial<Record<keyof T, string | boolean | object>>, // Свойства элемента
    children?: HTMLElement | HTMLElement [] // Дочерние элементы
): T {
    const element = document.createElement(tagName) as T; // Создаем новый элемент
    if (props) {
        for (const key in props) {
            const value = props[key];
            if (isPlainObject(value) && key === 'dataset') {
                setElementData(element, value); // Устанавливаем dataset
            } else {
                // @ts-expect-error fix indexing later
                element[key] = isBoolean(value) ? value : String(value); // Устанавливаем свойства
            }
        }
    }
    if (children) {
        for (const child of Array.isArray(children) ? children : [children]) {
            element.append(child); // Добавляем дочерние элементы
        }
    }
    return element;
}

type Callback<T> = (key: string, value: unknown) => void;

/**
 * Рекурсивно оборачивает объект в Proxy
 * @param obj
 * @param callback
 */
export function makeObservable<T extends object>(obj: T, callback: Callback<T>): T {
    return new Proxy(obj, {
        get(target: T & Record<string, unknown>, key: string): any {
            const value = target[key];

            if (value && typeof value === 'object') {
                return makeObservable(value, (nestedKey, nestedValue) => {
                    const fullPath = `${key}.${nestedKey}`;
                    callback(fullPath, nestedValue); // Вызываем callback с полным путем и значением
                });
            }

            return value;
        },
        set(target: T, key: string, value: unknown, receiver: T): boolean {
            let success = Reflect.set(target, key, value, receiver);
            if (success) {
                callback(key, value); // Вызываем callback при изменении значения
            }
            return success;
        },
    });
}
