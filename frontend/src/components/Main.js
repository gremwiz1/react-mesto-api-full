import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';
function Main({ onAddPlace, onEditProfile, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {

    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile">
                <div className="profile__change-avatar" onClick={onEditAvatar}>
                    <img className="profile__avatar" src={`${currentUser.avatar}`} alt="аватар"/>
                </div>
                <div className="profile__info">
                    <h1 className="profile__title">{currentUser.name}</h1>
                    <button onClick={onEditProfile} className="profile-button" type="button"></button>
                    <p className="profile__profession">{currentUser.about}</p>
                </div>
                <button onClick={onAddPlace} className="add-button" type="button"></button>
            </section>
            <section className="elements">
                {cards.map(item => (
                    <Card card={item} key={item._id} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />

                ))}
            </section>
        </main>
    );
}

export default Main;