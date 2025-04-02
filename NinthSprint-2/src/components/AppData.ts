import {Model} from "./base/Model";
import {IProduct, IOrder, IDeliveryForm, IAppState, FormErrors, IContactForm} from "../types";

export type CatalogChangeEvent = {
  catalog: Product[]
};

export class Product extends Model<IProduct> {
    id: string;
    title: string;
    price: number | null;
    description: string;
    category: string;
    image: string;
}

export class AppState extends Model<IAppState> {
  catalog: Product[];
  basket: Product[] = [];
  order: IOrder = {
    payment: 'online',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };
  preview: string | null;
  formErrors: FormErrors = {};

  clearBasket() {
    this.basket = [];
    this.updateBasket();
  }

  clearOrder() {
    this.order = {
      payment: 'online',
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: []
    }
  }

  setCatalog(items: IProduct[]) {
    this.catalog = items.map(item => new Product(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog});
  }

  setPreview(item: Product) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  addToBasket(item: Product){
    if(this.basket.indexOf(item) < 0){
      this.basket.push(item);
      this.updateBasket();
    }
  }

  removeFromBasket(item: Product) {
    this.basket = this.basket.filter((it) => it != item);
    this.updateBasket();
  }

  updateBasket(){
    this.emitChanges('counter:changed', this.basket);
    this.emitChanges('basket:changed', this.basket);
  }

  setDeliveryField(field: keyof IDeliveryForm, value: string) {
    this.order[field] = value;
    if(this.validateDelivery()) {
      this.events.emit('delivery:ready', this.order);
    }
  }

  setContactField(field: keyof IContactForm, value: string) {
    this.order[field] = value;
    if(this.validateContact()) {
      this.events.emit('contact:ready', this.order);
    }
  }

  validateDelivery(){
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = "Необходимо указать адрес"
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContact(){
    const errors: typeof this.formErrors = {};
    
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    } else if (!this.order.email.includes('@')) {
      errors.email = 'Email должен содержать @';
    }
    
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!/^\+7\d{10}$/.test(this.order.phone)) {
      errors.phone = 'Телефон должен начинаться с +7 и содержать 11 цифр';
    }
    
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    
    return Object.keys(errors).length === 0;
  }
}
