import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import { Redirect, Switch, Route, useHistory } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import * as auth from '../utils/auth';
import InfoTooltip from './InfoTooltip';
function App() {
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState("");
  const [infoTooltipMessage, setInfoTooltipMessage] = React.useState("");
  const history = useHistory();
  React.useEffect(() => {
    Promise.all([
      api.getUserProfile(),
      api.getInitialCards()
    ]).then(([result, cards]) => {
      setCurrentUser(result);
      setCards(cards);
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard(null);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleUpdateUser(item) {

    api.editUserProfile(item)
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      }).catch((err) => {
        console.log(err);
      });
  }
  function handleUpdateAvatar(avatar) {
    console.log(avatar);
    api.changeAvatarImage(avatar.avatar)
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      }).catch((err) => {
        console.log(err);
      });
  }
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (isLiked) {
      api.deleteLikeClick(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        }).catch((err) => {
          console.log(err);
        })
    }
    else {
      api.putLikeClick(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        }).catch((err) => {
          console.log(err);
        })
    }
  }
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then((newCard) => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      }).catch((err) => {
        console.log(err);
      })
  }
  function handleAddPlaceSubmit(card) {
    api.addItem(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      }).catch((err) => {
        console.log(err);
      });
  }
  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setToken(jwt);
      auth.getContent(jwt)
        .then((data) => {
          setLoggedIn(true);
          setEmail(data.data.email);
          history.push('/');
        }).catch((err) => {
          if (err === 400) return console.log('Токен не передан или передан не в том формате');
          if (err === 401) return console.log('Переданный токен некорректен');
          console.log(err);
        })
    }
  }
  React.useEffect(() => {
    tokenCheck();
  }, []);
  function onRegister({ email, password }) {
    auth.register({ email, password })
      .then((data) => {
        if (data) {
          setIsInfoTooltipPopupOpen(true);
          setIsSuccess(true);
          setInfoTooltipMessage('Вы успешно зарегистрировались!');
          history.push('/signin');
        }
      }).catch((err) => {
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(false);
        setInfoTooltipMessage('Что-то пошло не так! Попробуйте ещё раз.');
        if (err === 400) return console.log('некорректно заполнено одно из полей ');
        console.log(err);
      })
  }
  function onLogin({ email, password }) {
    auth.authorize({ email, password })
      .then((data) => {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('jwt', data.token);
          setEmail(email);
          setLoggedIn(true);
          setIsInfoTooltipPopupOpen(true);
          setIsSuccess(true);
          setInfoTooltipMessage('Вы успешно авторизировались!');
          history.push('/');
        }
      }).catch((err) => {
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(false);
        if (err === 400) return setInfoTooltipMessage('не передано одно из полей');
        if (err === 401) return setInfoTooltipMessage('пользователь с email не найден');
        setInfoTooltipMessage('Попробуйте еще раз!');
        console.log(err);
      })
  }
  function onSignOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push('/signin');
  }
  return (
    <div className="root">
      <div className="page">
        <Header email={email} onClick={onSignOut} />
        <CurrentUserContext.Provider value={currentUser}>
          <Switch>
            <ProtectedRoute exact path="/" loggedIn={loggedIn}>
              <Main cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete} onAddPlace={handleAddPlaceClick} onEditProfile={handleEditProfileClick} onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick} />
            </ProtectedRoute>
            <Route path="/signin">
              <Login onLogin={onLogin} />
            </Route>
            <Route path="/signup">
              <Register onRegister={onRegister} />
            </Route>
            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
            </Route>
          </Switch>
          <Footer />
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
          <InfoTooltip isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups} isSuccess={isSuccess} message={infoTooltipMessage} />
        </CurrentUserContext.Provider>
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>

    </div>

  );
}


export default App;
