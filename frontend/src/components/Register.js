import React from 'react';
import AutorizationForm from './AutorizationForm';

function Register({ onRegister }) {
    function handleSubmit(e, { email, password }) {
        e.preventDefault();
        onRegister({ email, password });
    }
    return (

        <AutorizationForm name={'Регистрация'} textButton={'Зарегистрироваться'} onSubmit={handleSubmit} loginLink={true} />

    );
}
export default Register;