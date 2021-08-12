import React from 'react';
function ImagePopup(props) {
  return (
    <div className={`popup popup_image ${props.card ? 'popup_opened' : ' '}`}>
      <div className="popup__container-image">
        <img className="popup__image" src={props.card ? `${props.card.link}` : ""} alt={props.card ? `${props.card.name}` : ""} />
        <p className="popup__text">{props.card ? props.card.name : ""}</p>
        <button className="popup__button-close" onClick={props.onClose} type="button"></button>
      </div>
    </div>
  );
}
export default ImagePopup;