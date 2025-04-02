// Типы для реализации базового класса Events
export type EventName = string | RegExp;
// eslint-disable-next-line @typescript-eslint/ban-types
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};

// Общие методы события
export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// Данные ответа от сервера
export type ApiListResponse<Type> = {
  total: number,
  items: Type[]
};

// Методы запросов к серверу
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Данные обработчика валидности формы
export interface IFormState {
    valid: boolean;
    errors: string[];
}

// Данные контента для отрисовки внутри Модалки
export interface IModalData {
    content: HTMLElement;
}

// Описание методов для Api приложения
export interface ILarekAPI {
  getProductList: () => Promise<IProduct[]>;
  getProductItem: (id: string) => Promise<IProduct>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>
}

// Данные товара
export interface IProduct {
  id: string;
  title: string;
  price: number | null;
  description: string;
  category: string;
  image: string;
}

// Состояние приложения
export interface IAppState {
  catalog: IProduct[];
  basket: IProduct[];
  preview: string | null;
  delivery: IDeliveryForm | null;
  contact: IContactForm | null;
  order: IOrder | null;
}

// Данные доставки
export interface IDeliveryForm {
  payment: string;
  address: string;
}

// Контактные данные
export interface IContactForm {
  email: string;
  phone: string;
}

// Данные всего заказа
export interface IOrder extends IDeliveryForm, IContactForm {
  total: number;
  items: string[];
}

// Данные ответа сервера на заказ
export interface IOrderResult {
  id: string;
  total: number;
}

// Ошибки Форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Данные для отображения карточки
export interface ICard extends IProduct{
  index?: string;
  buttonTitle? : string;
}

// Данные для отображения корзиный
export interface IBasketView {
  items: HTMLElement[];
  total: number;
}

// Данный для отображения главной страницы
export interface IPage{
  counter: number;
  catalog: HTMLElement[];
}

//Данные для отображения успешного заказа
export interface ISuccess {
  total: number;
}

// Действия передаваемые в конструктор
export interface IActions {
  onClick: (event: MouseEvent) => void;
}

// Действия передаваемые в конструктор успешного заказа
export interface ISuccessActions {
  onClick: () => void;
}
