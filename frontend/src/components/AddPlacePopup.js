import React from 'react';
import PopupWithForm from './PopupWithForm';
function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
    const [name, setName] = React.useState('');
    const [path, setPath] = React.useState('');
    React.useEffect(() => {
        setName('');
        setPath('');
    },[isOpen]);
    function handleChangeName(e) {
        setName(e.target.value);
    }
    function handleChangePath(e) {
        setPath(e.target.value);
    }
    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({
            name: name,
            link: path
        });
    }

    return (
        <PopupWithForm isOpen={isOpen} onSubmit={handleSubmit} name={'popup_add-card'} title={"Новое место"}
            onClose={onClose} children={
                <>
                    <input className="popup-container__name" type="text" name="nameimage"
                        placeholder="Название" value={name} onChange={handleChangeName} minLength="2" maxLength="30" required />
                    <span className="popup-container__error"></span>
                    <input className="popup-container__name" value={path} onChange={handleChangePath} type="url" name="path"
                        placeholder="Ссылка на картинку" required />
                    <span className="popup-container__error"></span>
                </>
            } />
    );
}
export default AddPlacePopup;