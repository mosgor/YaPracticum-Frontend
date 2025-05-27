import Cypress from 'cypress';

const API = 'https://norma.nomoreparties.space/api';
const bunSelector = (id: string) => `[data-cy='${id}'] button`;
const ingredientLink = (id: string) => `[data-cy='${id}'] a`;

beforeEach(() => {
  cy.intercept('GET', `${API}/ingredients`, { fixture: 'ingredients.json' });
  cy.intercept('POST', `${API}/auth/login`, { fixture: 'user.json' });
  cy.intercept('GET', `${API}/auth/user`, { fixture: 'user.json' });
  cy.intercept('POST', `${API}/orders`, { fixture: 'orderResponse.json' });

  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get('#modals').as('modalContainer');
});

describe('Order constructor interactions', () => {
  it('should increment ingredient count when clicked', () => {
    // считаем, что счетчик изначально пуст
    cy.get(bunSelector('643d69a5c3f7b9001cfa0941')).click();
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').find('.counter__num').should('contain', '1');
  });

  describe('Bun & filling addition', () => {
    it('adds bun then filling', () => {
      cy.get(bunSelector('643d69a5c3f7b9001cfa093c')).click();
      cy.get(bunSelector('643d69a5c3f7b9001cfa0941')).click();
    });

    it('adds filling then bun', () => {
      cy.get(bunSelector('643d69a5c3f7b9001cfa0941')).click();
      cy.get(bunSelector('643d69a5c3f7b9001cfa093c')).click();
    });
  });

  describe('Switching buns', () => {
    const firstBun = '643d69a5c3f7b9001cfa093c';
    const secondBun = '643d69a5c3f7b9001cfa093d';

    it('replaces bun when no fillings', () => {
      cy.get(bunSelector(firstBun)).click();
      cy.get(bunSelector(secondBun)).click();
    });

    it('replaces bun after adding filling', () => {
      cy.get(bunSelector(firstBun)).click();
      cy.get(bunSelector('643d69a5c3f7b9001cfa0941')).click();
      cy.get(bunSelector(secondBun)).click();
    });
  });
});

describe('Order submission process', () => {
  beforeEach(() => {
    // моким авторизацию в localStorage и куках
    window.localStorage.setItem('refreshToken', 'fakeToken');
    cy.setCookie('accessToken', 'fakeAccess');
    cy.getAllLocalStorage().should('not.be.empty');
    cy.getCookie('accessToken').should('exist');
  });

  afterEach(() => {
    // очищаем после теста
    window.localStorage.clear();
    cy.clearAllCookies();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });

  it('submits order and shows confirmation', () => {
    cy.get(bunSelector('643d69a5c3f7b9001cfa093c')).click();
    cy.get(bunSelector('643d69a5c3f7b9001cfa0941')).click();
    cy.get("[data-cy='order-button']").click();
    cy.get('@modalContainer').find('h2').should('contain.text', '38483');
  });
});

describe('Modal windows behavior', () => {
  it('opens ingredient details modal', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(ingredientLink('643d69a5c3f7b9001cfa0941')).click();
    // проверяем URL и появление модалки
    cy.url().should('include', '643d69a5c3f7b9001cfa0941');
    cy.get('@modalContainer').should('not.be.empty');
  });

  it('closes modal with close button', () => {
    // реальный пользователь нажал крестик
    cy.get(ingredientLink('643d69a5c3f7b9001cfa0941')).click();
    cy.get('@modalContainer').find('button').click();
    cy.get('@modalContainer').should('be.empty');
  });

  it('closes modal by clicking overlay', () => {
    cy.get(ingredientLink('643d69a5c3f7b9001cfa0941')).click();
    cy.get("[data-cy='overlay']").click({ force: true }); // ведь оверлей может быть под другими слоями
    cy.get('@modalContainer').should('be.empty');
  });

  it('closes modal with Escape key', () => {
    cy.get(ingredientLink('643d69a5c3f7b9001cfa0941')).click();
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@modalContainer').should('be.empty');
  });
});
