import { Api, ApiListResponse } from './base/api'; // Импорт базового класса API и типа для ответа с элементами списка
import { IOrder, IOrderResult, ILot, LotUpdate, IBid } from "../types"; // Импорт интерфейсов и типов для лотов, заказов и ставок

export interface IAuctionAPI {
    getLotList: () => Promise<ILot[]>; // Получить список лотов
    getLotItem: (id: string) => Promise<ILot>; // Получить данные одного лота по ID
    getLotUpdate: (id: string) => Promise<LotUpdate>; // Получить обновление лота (например, ставки и статус)
    placeBid: (id: string, bid: IBid) => Promise<LotUpdate>; // Разместить ставку на лот
    orderLots: (order: IOrder) => Promise<IOrderResult>; // Сделать заказ на лоты
}

export class AuctionAPI extends Api implements IAuctionAPI {
    readonly cdn: string; // Ссылка на CDN для изображений лотов

    // Конструктор, инициализирует базовый API и CDN для изображений
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options); // Вызывает конструктор базового API
        this.cdn = cdn; // Устанавливает ссылку на CDN
    }

    // Получение одного лота по ID
    getLotItem(id: string): Promise<ILot> {
        return this.get(`/lot/${id}`).then(
            (item: ILot) => ({
                ...item, // Расширяет лот, добавляя правильный URL изображения
                image: this.cdn + item.image, // Обновление пути к изображению
            })
        );
    }

    // Получение обновлений для лота по ID
    getLotUpdate(id: string): Promise<LotUpdate> {
        return this.get(`/lot/${id}/_auction`).then(
            (data: LotUpdate) => data // Возвращает данные обновлений лота
        );
    }

    // Получение списка всех лотов
    getLotList(): Promise<ILot[]> {
        return this.get('/lot').then((data: ApiListResponse<ILot>) =>
            data.items.map((item) => ({
                ...item, // Добавляет путь к изображению для каждого лота
                image: this.cdn + item.image
            }))
        );
    }

    // Размещение ставки на лот
    placeBid(id: string, bid: IBid): Promise<LotUpdate> {
        return this.post(`/lot/${id}/_bid`, bid).then(
            (data: ILot) => data // Возвращает обновленные данные лота после размещения ставки
        );
    }

    // Сделать заказ на лоты
    orderLots(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data // Возвращает результат оформления заказа
        );
    }
}
