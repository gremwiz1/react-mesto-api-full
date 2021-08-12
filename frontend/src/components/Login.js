import React from 'react';
import AutorizationForm from './AutorizationForm';
function Login({ onLogin }) {
    function handleSubmit(e, { email, password }) {
        e.preventDefault();
        onLogin({ email, password });
    }
    return (
        <AutorizationForm name={'Вход'} textButton={'Войти'} onSubmit={handleSubmit} loginLink={false} />
    );
}
export default Login;