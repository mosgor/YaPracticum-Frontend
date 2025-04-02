// Тип состояния лота, может быть 'wait' (ожидает начала), 'active' (активный), 'closed' (закрыт)
export type LotStatus = 'wait' | 'active' | 'closed';

// Интерфейс для аукциона, содержащий статус, дату и время, цену и минимальную цену лота
export interface IAuction {
    status: LotStatus; // Статус аукциона
    datetime: string; // Время начала или завершения аукциона
    price: number; // Текущая цена лота
    minPrice: number; // Минимальная цена для лота
    history?: number[]; // История ставок
}

// Интерфейс для лота, который включает основные данные: id, название, описание и изображение
export interface ILotItem {
    id: string; // Идентификатор лота
    title: string; // Название лота
    about: string; // Краткое описание лота
    description?: string; // Полное описание лота (опционально)
    image: string; // Ссылка на изображение лота
}

// Тип для объединения свойств лота и аукциона
export type ILot = ILotItem & IAuction;

// Тип для обновлений лота, включающий id, дату, статус, цену и историю ставок
export type LotUpdate = Pick<ILot, 'id' | 'datetime' | 'status' | 'price' | 'history'>;

// Тип для элементов корзины, включающий id, название, цену и информацию о том, является ли ставка текущим пользователем
export type IBasketItem = Pick<ILot, 'id' | 'title' | 'price'> & {
    isMyBid: boolean; // Является ли текущая ставка моей
}

// Интерфейс для состояния приложения, включая каталог лотов, корзину, предпросмотр, заказ и статус загрузки
export interface IAppState {
    catalog: ILot[]; // Список всех лотов
    basket: string[]; // Список ID лотов в корзине
    preview: string | null; // ID выбранного для предпросмотра лота
    order: IOrder | null; // Заказ (если есть)
    loading: boolean; // Статус загрузки
}

// Интерфейс для формы заказа, включающий email и телефон
export interface IOrderForm {
    email: string; // Email покупателя
    phone: string; // Телефон покупателя
}

// Интерфейс для заказа, расширяющий форму заказа и добавляющий список товаров
export interface IOrder extends IOrderForm {
    items: string[]; // Список ID лотов в заказе
}

// Тип для ошибок формы, где ключами являются свойства IOrder, а значениями — строки с ошибками
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс для ставки, включающий цену ставки
export interface IBid {
    price: number; // Сумма ставки
}

// Интерфейс для результата оформления заказа, который возвращает id заказа
export interface IOrderResult {
    id: string; // Идентификатор заказа
}
