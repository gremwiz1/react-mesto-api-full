import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
function Card({card, onCardClick, onCardLike, onCardDelete}) {
    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = card.owner._id === currentUser._id;
    const cardDeleteButtonClassName = (
        `element__button-delete ${isOwn ? 'element__button-delete_visible' : 'element__button-delete_hidden'}`
      );
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = (`element__like ${isLiked ? 'element__like-active' : ''}`);
    function handleCardClick() {
        onCardClick(card);
    }
    function handleLikeClick() {
        onCardLike(card);
    }
    function handleDeleteClick() {
        onCardDelete(card);
    }
    return (
        <div className="element">
            <button className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
            <img className="element__image" alt={`${card.name}`} src={card.link}
                onClick={handleCardClick} />
            <div className="element__description">
                <h2 className="element__title">{card.name}</h2>
                <div>
                    <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}></button>
                    <p className="element__like-numbers">{card.likes.length}</p>

                </div>

            </div>
        </div>
    );

}
export default Card;