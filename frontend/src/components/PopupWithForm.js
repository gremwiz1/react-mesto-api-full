import React from 'react';
function PopupWithForm(props) {

  return (
    <div className={`popup ${props.name} ${props.isOpen ? 'popup_opened' : ' '}`}>
      <div className="popup__container">
        <h2 className="popup__title">{props.title}</h2>
        <form className="popup-container" name={props.name} action="#" onSubmit={props.onSubmit}>
          {props.children}
          <button className="submit-button" type="submit">Сохранить</button>
        </form>
        <button onClick={props.onClose} className="popup__button-close" type="button"></button>
      </div>

    </div>
  );
}
export default PopupWithForm;