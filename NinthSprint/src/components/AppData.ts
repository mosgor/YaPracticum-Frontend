import _ from "lodash"; // Импорт библиотеки lodash для удобной работы с коллекциями
import { dayjs, formatNumber } from "../utils/utils"; // Импорт утилит для работы с датами и форматированием чисел

import { Model } from "./base/Model"; // Базовый класс модели
import { FormErrors, IAppState, IBasketItem, ILot, IOrder, IOrderForm, LotStatus } from "../types"; // Импорт типов и интерфейсов

export type CatalogChangeEvent = {
    catalog: LotItem[]; // Тип события изменения каталога, содержащее массив лотов
};

// Класс, представляющий отдельный лот на аукционе
export class LotItem extends Model<ILot> {
    about: string; // Описание лота
    description: string; // Подробное описание лота
    id: string; // Идентификатор лота
    image: string; // Ссылка на изображение лота
    title: string; // Заголовок лота
    datetime: string; // Время начала аукциона
    history: number[]; // История ставок
    minPrice: number; // Минимальная цена для лота
    price: number; // Текущая цена лота
    status: LotStatus; // Статус лота (например, активен, закрыт, ожидает начала)

    protected myLastBid: number = 0; // Ставка пользователя

    // Метод для сброса последней ставки
    clearBid() {
        this.myLastBid = 0;
    }

    // Метод для размещения ставки
    placeBid(price: number): void {
        this.price = price;
        this.history = [...this.history.slice(1), price]; // Обновление истории ставок
        this.myLastBid = price;

        // Закрытие аукциона, если ставка превышает 10-кратную минимальную цену
        if (price > (this.minPrice * 10)) {
            this.status = 'closed';
        }
        this.emitChanges('auction:changed', { id: this.id, price }); // Генерация события изменения аукциона
    }

    // Геттер для проверки, является ли ставка пользователя последней
    get isMyBid(): boolean {
        return this.myLastBid === this.price;
    }

    // Геттер для проверки, участвовал ли пользователь в аукционе
    get isParticipate(): boolean {
        return this.myLastBid !== 0;
    }

    // Геттер для отображения метки статуса аукциона
    get statusLabel(): string {
        switch (this.status) {
            case "active":
                return `Открыто до ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`;
            case "closed":
                return `Закрыто ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`;
            case "wait":
                return `Откроется ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`;
            default:
                return this.status;
        }
    }

    // Геттер для отображения времени до закрытия аукциона или времени завершения
    get timeStatus(): string {
        if (this.status === 'closed') return 'Аукцион завершен';
        else return dayjs
            .duration(dayjs(this.datetime).valueOf() - Date.now()) // Рассчитывает оставшееся время
            .format('D[д] H[ч] m[ мин] s[ сек]');
    }

    // Геттер для отображения статуса аукциона
    get auctionStatus(): string {
        switch (this.status) {
            case 'closed':
                return `Продано за ${formatNumber(this.price)}₽`; // Показывает цену продажи
            case 'wait':
                return 'До начала аукциона';
            case 'active':
                return 'До закрытия лота';
            default:
                return '';
        }
    }

    // Геттер для следующей возможной ставки
    get nextBid(): number {
        return Math.floor(this.price * 1.1); // Следующая ставка - на 10% больше текущей цены
    }
}

// Класс, представляющий состояние приложения
export class AppState extends Model<IAppState> {
    basket: string[]; // Список ID выбранных товаров
    catalog: LotItem[]; // Каталог лотов
    loading: boolean; // Статус загрузки
    order: IOrder = {
        email: '',
        phone: '',
        items: []
    };
    preview: string | null; // ID текущего лота, который выбран для предварительного просмотра
    formErrors: FormErrors = {}; // Ошибки формы

    // Метод для переключения лота в заказе
    toggleOrderedLot(id: string, isIncluded: boolean) {
        if (isIncluded) {
            this.order.items = _.uniq([...this.order.items, id]); // Добавление лота в заказ
        } else {
            this.order.items = _.without(this.order.items, id); // Удаление лота из заказа
        }
    }

    // Метод для очистки корзины
    clearBasket() {
        this.order.items.forEach(id => {
            this.toggleOrderedLot(id, false); // Убирает все лоты из заказа
            this.catalog.find(it => it.id === id)?.clearBid(); // Сбрасывает ставки по этим лотам
        });
    }

    // Метод для получения общей стоимости заказа
    getTotal() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0);
    }

    // Метод для установки нового каталога
    setCatalog(items: ILot[]) {
        this.catalog = items.map(item => new LotItem(item, this.events)); // Преобразует данные в объекты LotItem
        this.emitChanges('items:changed', { catalog: this.catalog }); // Генерация события о изменении каталога
    }

    // Метод для установки превью лота
    setPreview(item: LotItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item); // Генерация события о изменении превью
    }

    // Метод для получения всех активных лотов
    getActiveLots(): LotItem[] {
        return this.catalog
            .filter(item => item.status === 'active' && item.isParticipate); // Возвращает только активные лоты, в которых участвовал пользователь
    }

    // Метод для получения всех закрытых лотов
    getClosedLots(): LotItem[] {
        return this.catalog
            .filter(item => item.status === 'closed' && item.isMyBid); // Возвращает закрытые лоты, на которых сделана ставка
    }

    // Метод для установки поля в заказе
    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) { // Проверка формы
            this.events.emit('order:ready', this.order); // Генерация события, если форма готова
        }
    }

    // Метод для валидации формы
    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors); // Генерация события об ошибках формы
        return Object.keys(errors).length === 0;
    }
}
