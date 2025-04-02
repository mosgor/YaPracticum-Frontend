// Определяет универсальный тип ApiListResponse, который принимает тип Type и включает два свойства: total и items.
export type ApiListResponse<Type> = {
    total: number, // Общее количество элементов.
    items: Type[] // Массив элементов типа Type.
};

// Определяет тип ApiPostMethods, который ограничивает возможные значения метода HTTP на 'POST', 'PUT' или 'DELETE'.
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Определяет класс Api для взаимодействия с API.
export class Api {
    readonly baseUrl: string; // Свойство readonly, которое хранит базовый URL для запросов к API.
    protected options: RequestInit; // Защищенное свойство, которое хранит настройки для HTTP-запросов.

    // Конструктор, инициализирующий класс с базовым URL и дополнительными опциями для запросов.
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl; // Устанавливает базовый URL, переданный в аргументе конструктора.
        this.options = { // Устанавливает настройки по умолчанию для запросов, включая заголовки.
            headers: {
                'Content-Type': 'application/json', // Заголовок по умолчанию для указания, что контент в формате JSON.
                ...(options.headers as object ?? {}) // Объединяет переданные заголовки (если есть) с настройками по умолчанию.
            }
        };
    }

    // Метод для обработки ответа API. Проверяет статус ответа и обрабатывает его соответственно.
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json(); // Если ответ успешный (статус 200-299), парсим тело ответа как JSON.
        else return response.json() // Если ответ не успешный, отклоняем промис с ошибкой.
            .then(data => Promise.reject(data.error ?? response.statusText)); // Отклоняет промис с сообщением об ошибке или текстом статуса.
    }

    // Метод GET для получения данных с указанного URI.
    get(uri: string) {
        return fetch(this.baseUrl + uri, { // Выполняет запрос на полный URI.
            ...this.options, // Использует настройки по умолчанию для заголовков.
            method: 'GET' // Указывает HTTP-метод как GET.
        }).then(this.handleResponse); // Обрабатывает ответ через метод handleResponse.
    }

    // Метод POST для отправки данных на сервер с указанным HTTP-методом (POST, PUT, DELETE).
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, { // Выполняет запрос на полный URI.
            ...this.options, // Использует настройки по умолчанию для заголовков.
            method, // Использует указанный HTTP-метод (по умолчанию 'POST').
            body: JSON.stringify(data) // Отправляет данные как JSON в теле запроса.
        }).then(this.handleResponse); // Обрабатывает ответ через метод handleResponse.
    }
}
