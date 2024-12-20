export class Api {
  constructor(options) {
    this._headers = options.headers;
    this._serverURL = options.serverURL;
    this._handlePromiseReturn = ((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }

   // Работа с пользователем

  getUserInfo() {
    return fetch(`${this._serverURL}/users/me`, {
      headers: this._headers
    })
      .then((res) => this._handlePromiseReturn(res));
  }

  sendUserInfo(data) {
    return fetch(`${this._serverURL}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
      .then((res) => this._handlePromiseReturn(res));
  }

  updateAvatar(avatar) {
    return fetch(`${this._serverURL}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar
      })
    })
      .then((res) => this._handlePromiseReturn(res));
  }

  // Работа с карточками

  getCards() {
    return fetch(`${this._serverURL}/cards`, {
      headers: this._headers
    })
      .then((res) => this._handlePromiseReturn(res));
  }

  sendCard(data) {
    return fetch(`${this._serverURL}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
      .then((res) => this._handlePromiseReturn(res));
  }

  deleteCard(cardID) {
    return fetch(`${this._serverURL}/cards/${cardID}`, {
      method: 'DELETE',
      headers: this._headers
    });
  }

  setLike(cardID) {
    return fetch(`${this._serverURL}/cards/${cardID}/likes`, {
      method: 'PUT',
      headers: this._headers
    })
      .then((res) => this._handlePromiseReturn(res));
  }

  deleteLike(cardID) {
    return fetch(`${this._serverURL}/cards/${cardID}/likes`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then((res) => this._handlePromiseReturn(res));
  }
}
