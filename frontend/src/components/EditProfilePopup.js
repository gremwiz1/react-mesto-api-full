import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const currentUser = React.useContext(CurrentUserContext);
    function handleChangeName(e) {
        setName(e.target.value);
    }
    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }
    React.useEffect(() => {
        setName(currentUser.name || "");
        setDescription(currentUser.about || "");
    }, [currentUser, isOpen]);
    function handleSubmit(evt) {
        // Запрещаем браузеру переходить по адресу формы
        evt.preventDefault();
        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
            name: name,
            about: description
        });
    }
    return (

        <PopupWithForm onSubmit={handleSubmit} isOpen={isOpen} name={'popup_edit-profile'} title={'Редактировать профиль'}
            onClose={onClose} children={
                <>
                    <input className="popup-container__name" type="text" name="name" placeholder="Имя"
                        minLength="2" maxLength="40" value={name} onChange={handleChangeName} required />
                    <span className="popup-container__error"></span>
                    <input className="popup-container__name" type="text" name="about"
                        placeholder="Вид деятельности" minLength="2" maxLength="200" value={description} onChange={handleChangeDescription} required />
                    <span className="popup-container__error"></span>
                </>
            } />

    );
}
export default EditProfilePopup;