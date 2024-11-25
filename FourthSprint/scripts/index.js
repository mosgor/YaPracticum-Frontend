// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const placesList = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profilePopup = document.querySelector('.popup_type_edit');
const profileFormElement = profilePopup.querySelector('.popup__form');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');

const cardPopup = document.querySelector('.popup_type_new-card');
const cardFormElement = cardPopup.querySelector('.popup__form');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');

const imagePopup = document.querySelector('.popup_type_image');

// Функция создания карточки
function createCard(name, link) {
    const card = cardTemplate.querySelector('.card').cloneNode(true);
    card.querySelector('.card__title').textContent = name;
    const cardImage = card.querySelector('.card__image');
    cardImage.setAttribute("src", link);
    cardImage.setAttribute("alt", name);
    return card;
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(profilePopup);
}

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    placesList.prepend(createCard(cardNameInput.value, cardLinkInput.value));
    closeModal(cardPopup);
}

// @todo: Функция удаления карточки

function openModal(popup) {
    popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

// Вывести карточки на страницу
initialCards.forEach((card) => {
    placesList.append(createCard(card.name, card.link));
})

document.querySelector('.profile__edit-button').addEventListener('click', () => {
    nameInput.setAttribute('value', profileTitle.textContent);
    jobInput.setAttribute('value', profileDescription.textContent);
    openModal(profilePopup);
})

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

document.querySelector('.profile__add-button').addEventListener('click', () => {
    cardNameInput.value = '';
    cardLinkInput.value = '';
    openModal(cardPopup);
})

cardFormElement.addEventListener('submit', handleCardFormSubmit);

document.querySelectorAll('.popup__close').forEach((popupClose) => {
    popupClose.addEventListener('click', (event) => {
        closeModal(event.target.closest('.popup'));
    })
})
