import Cypress from 'cypress';


const BASE_URL = 'https://norma.nomoreparties.space/api';
const ID_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`;
const ID_ANOTHER_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`;
const ID_FILLING = `[data-cy=${'643d69a5c3f7b9001cfa0941'}]`;

beforeEach(() => {
  cy.intercept('GET', `${BASE_URL}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('POST', `${BASE_URL}/auth/login`, {
    fixture: 'user.json'
  });
  cy.intercept('GET', `${BASE_URL}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${BASE_URL}/orders`, {
    fixture: 'orderResponse.json'
  });
  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get('#modals').as('modal');
});

describe('добавление ингредиента в список заказа', () => {
  it('инкремент счетчика ингредиента', () => {
    cy.get(ID_FILLING).children('button').click();
    cy.get(ID_FILLING).find('.counter__num').contains('1');
  });
  describe('добавление булок и начинок', () => {
    it('добавление булки и начинки в список заказа', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_FILLING).children('button').click();
    });
    it('добавление булки после добавления начинок', () => {
      cy.get(ID_FILLING).children('button').click();
      cy.get(ID_BUN).children('button').click();
    });
  });
  describe('замена булок', () => {
    it('замена булки другой булкой при пустом списке начинок', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
    });
    it('замена булки другой булкой при полном списке начинок ', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_FILLING).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
    });
  });
});

describe('оформление заказа', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'ipsum');
    cy.setCookie('accessToken', 'lorem');
    cy.getAllLocalStorage().should('be.not.empty');
    cy.getCookie('accessToken').should('be.not.empty');
  });
  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });


  it('отправка заказа c проверкой корректности ответа', () => {
    cy.get(ID_BUN).children('button').click();
    cy.get(ID_FILLING).children('button').click();
    cy.get(`[data-cy='order-button']`).click();
    cy.get('@modal').find('h2').contains('38483');
  });
});

describe('модельные окна', () => {
  it('открытие и проверка отображения данных модального окна ингредиента', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.url().should('include', '643d69a5c3f7b9001cfa0941');
  });
  it('закрытие модального окна ингредиента по клику на ‭«✕»', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('@modal').find('button').click();
    cy.get('@modal').should('be.empty');
  });
  it('закрытие модального окна ингредиента по клику на ‭оверлей', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get(`[data-cy='overlay']`).click({ force: true });
    cy.get('@modal').should('be.empty');
  });
  it('закрытие модального окна ингредиента по нажатию на «Escape»', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@modal').should('be.empty');
  });
});
