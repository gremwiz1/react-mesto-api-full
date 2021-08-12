import React from 'react';
import PopupWithForm from './PopupWithForm';
function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = React.useRef();
  React.useEffect(() => {
    avatarRef.current.value="";
  }, [isOpen]);
  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value
    });
  }
  return (
    <PopupWithForm onSubmit={handleSubmit} isOpen={isOpen} name={'popup_change-avatar'} title={'Обновить аватар'}
      onClose={onClose} children={
        <>
          <input ref={avatarRef} className="popup-container__name" type="url" name="path"
            placeholder="https://somewebsite.com/someimage.jpg" required />
          <span className="popup-container__error"></span>
        </>
      } />

  );
}
export default EditAvatarPopup;