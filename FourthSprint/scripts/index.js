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
const popupImageElement = imagePopup.querySelector('.popup__image');
const popupCaptionElement = imagePopup.querySelector('.popup__caption');

// Функция создания карточки
function createCard(name, link) {
	const card = cardTemplate.querySelector('.card').cloneNode(true);
	card.querySelector('.card__title').textContent = name;
	const cardImage = card.querySelector('.card__image');
	cardImage.setAttribute("src", link);
	cardImage.setAttribute("alt", name);
	card.querySelector('.card__like-button').addEventListener('click', (event) => {
		event.target.classList.toggle('card__like-button_is-active');
	})
	card.querySelector('.card__delete-button').addEventListener('click', handlerRemoveCard);
    cardImage.addEventListener('click', () => {
        popupImageElement.setAttribute('src', cardImage.getAttribute('src'));
        popupImageElement.setAttribute('alt', cardImage.getAttribute('alt'));
        popupCaptionElement.textContent = cardImage.getAttribute('alt');
        openModal(imagePopup);
    })
	return card;
}

function handleProfileFormSubmit(event) {
	event.preventDefault();
	profileTitle.textContent = nameInput.value;
	profileDescription.textContent = jobInput.value;
	closeModal(profilePopup);
}

function handleCardFormSubmit(event) {
	event.preventDefault();
	placesList.prepend(createCard(cardNameInput.value, cardLinkInput.value));
	closeModal(cardPopup);
}

// Функция удаления карточки
function handlerRemoveCard(event) {
    event.target.closest('.card').remove();
}

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

profilePopup.classList.add('popup_is-animated');
cardPopup.classList.add('popup_is-animated');
imagePopup.classList.add('popup_is-animated');

document.querySelector('.profile__edit-button').addEventListener('click', () => {
	nameInput.value = profileTitle.textContent;
	jobInput.value = profileDescription.textContent;
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
