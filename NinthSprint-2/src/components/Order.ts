import {Form} from "./common/Form";
import {IDeliveryForm, IContactForm, IActions} from "../types";
import {IEvents} from "../types";
import {ensureElement} from "../utils/utils";

export class DeliveryForm extends Form<IDeliveryForm> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    super(container, events);

    this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this._cardButton.classList.add('button_alt-active');

    if (actions?.onClick) {
        this._cardButton.addEventListener('click', actions.onClick);
        this._cashButton.addEventListener('click', actions.onClick);
    }
  }

  toggleButtons(target: HTMLElement){
    this._cardButton.classList.toggle('button_alt-active');
    this._cashButton.classList.toggle('button_alt-active');
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}

export class ContactForm extends Form<IContactForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}
