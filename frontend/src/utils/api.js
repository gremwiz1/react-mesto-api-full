class Api {
  constructor(baseUrl, authorization) {
    this._baseUrl = baseUrl;
    this._authorization = authorization;
  }

  getInitialCards() {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._baseUrl}/cards`, {
      headers: {
        authorization: this._authorization,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        // если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
      });

  }
  addItem(item) {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._baseUrl}/cards`, {
      method: 'POST',
      body: JSON.stringify({
        name: item.name,
        link: item.link
      }),
      headers: {
        authorization: this._authorization,
        'Content-Type': 'application/json'
      }

    }).then(res => {
      if (res.ok) {
        return res.json();
      }

      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }
  getUserProfile() {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._baseUrl}/users/me`, {
      headers: {
        authorization: this._authorization,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        // если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
      });

  }
  editUserProfile(item) {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this._authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: item.name,
        about: item.about
      })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        // если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
      });

  }
  putLikeClick(card) {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._baseUrl}/cards/likes/${card}`, {
      method: 'PUT',
      headers: {
        authorization: this._authorization,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.ok) {
        return res.json();
      }

      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }
  deleteLikeClick(card) {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._baseUrl}/cards/likes/${card}`, {
      method: 'DELETE',
      headers: {
        authorization: this._authorization,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.ok) {
        return res.json();
      }

      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }
  deleteCard(card) {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._baseUrl}/cards/${card}`, {
      method: 'DELETE',
      headers: {
        authorization: this._authorization,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.ok) {
        return res.json();
      }

      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }
  changeAvatarImage(item) {

    return fetch(`https://mesto.nomoreparties.co/v1/${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: item

      })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        // если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
      });
  }

  // другие методы работы с API
}
const api = new Api('cohort-23', '71d78780-0adb-4990-8076-8dfa433548e7');
export default api;
