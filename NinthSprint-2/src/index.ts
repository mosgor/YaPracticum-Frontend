import './scss/styles.scss';

import {LarekAPI} from "./components/LarekAPI";
import {API_URL, CDN_URL, PaymentMethods} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, Product} from "./components/AppData";
import {Page} from "./components/Page";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {IContactForm, IDeliveryForm, IOrder} from "./types";
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { DeliveryForm, ContactForm } from './components/Order';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Шаблоны верстки
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new DeliveryForm(cloneTemplate(deliveryTemplate), events, {
  onClick: (ev: Event) => events.emit('payment:toggle', ev.target)
});
const contact = new ContactForm(cloneTemplate(contactTemplate), events);


// Обновления каталога
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category
    })
  })
});

// Открытие товара
events.on('card:select', (item: Product) => {
  appData.setPreview(item);
});

events.on('preview:changed', (item: Product) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('product:toggle', item);
      card.buttonTitle = (appData.basket.indexOf(item) < 0) ? 'Купить' : 'Удалить из корзины'
    }
  });
  modal.render({
    content: card.render({
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      category: item.category,
      buttonTitle: (appData.basket.indexOf(item) < 0) ? 'Купить' : "Удалить из корзины"
    })
  })
})

// Переключение/добавление/удаление товара и обновление счетчика
events.on('product:toggle', (item: Product) => {
  //modal.close();
  if(appData.basket.indexOf(item) < 0){
    events.emit('product:add', item);
  }
  else{
    events.emit('product:delete', item);
  }
})

events.on('product:add', (item: Product) => {
  appData.addToBasket(item);

});

events.on('product:delete', (item: Product) => appData.removeFromBasket(item));

events.on('basket:changed', (items: Product[]) => {
  basket.items = items.map((item, index) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('product:delete', item)
      }
    });
    return card.render({
      index: (index+1).toString(),
      title: item.title,
      price: item.price,
    })
  })
  const total = items.reduce((total, item) => total + item.price, 0)
  basket.total = total
  appData.order.total = total;
  basket.toggleButton(total === 0)
})

events.on('counter:changed', (item: string[]) => {
  page.counter = appData.basket.length;
})

// Открытие корзины
events.on('basket:open', () => {
  modal.render({
    content: basket.render({})
  })
});

//Открытие формы доставки
events.on('order:open', () => {
  modal.render({
    content: delivery.render({
      payment: '',
      address: '',
      valid: false,
      errors:[]
    })
  })
  appData.order.items = appData.basket.map((item) => item.id);
})

// Смена способа оплаты заказа
events.on('payment:toggle', (target: HTMLElement) => {
  if(!target.classList.contains('button_alt-active')){
    delivery.toggleButtons(target);
    appData.order.payment = PaymentMethods[target.getAttribute('name')];
    console.log(appData.order)
  }
})

// Изменение состояния валидации форм
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const {payment, address ,email, phone} = errors;
  delivery.valid = !payment && !address;
  contact.valid = !email && !phone;
  delivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
  contact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменение полей доставки
events.on(/^order\..*:change/, (data: {field: keyof IDeliveryForm, value: string}) => {
  appData.setDeliveryField(data.field, data.value)
})

// Изменение полей контактов
events.on(/^contacts\..*:change/, (data: {field: keyof IContactForm, value: string}) => {
  appData.setContactField(data.field, data.value)
})

// Событие заполненности формы доставки
events.on('delivery:ready' , () => {
  delivery.valid = true;
})

// Событие заполненности формы контактов
events.on('contact:ready', () => {
  contact.valid = true;
})

// Событие перехода к форме контактов
events.on('order:submit', () => {
  modal.render({
    content: contact.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })
  })
})

// Оформление заказа
events.on('contacts:submit', () => {
  api.orderProducts(appData.order)
    .then((result) => {
      appData.clearBasket();
      appData.clearOrder();
      const success = new Success(cloneTemplate(successTemplate), {
          onClick: () => {
              modal.close();
          }
      });
      success.total = result.total.toString();

      modal.render({
          content: success.render({})
      });
    })
    .catch(err => {
        console.error(err);
    });
})

// Модальное окно открыто
events.on('modal:open', () => {
  page.locked = true;
});

// Модальное окно закрыто
events.on('modal:close', () => {
  page.locked = false;
});

// Получение списка продуктов при окрытие страницы
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
      console.log(err);
    });

