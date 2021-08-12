import React from 'react';
import { Link, Route } from 'react-router-dom';
function Header({ email, onClick }) {
  return (
    <header className="header">
      <Link to="/">
        <div className="header__logo"></div>
      </Link>
      <ul className="header__nav">
        <Route exact path="/">
          <li className="header__nav">
            <p className="header__email">{email}</p>
          </li>
          <li className="header__nav">
            <button className="header__out" onClick={onClick}>Выйти</button>
          </li>
        </Route>
        <Route path="/signin">
          <li className="header__nav">
            <Link to="/signup" className="header__sign">Регистрация</Link>
          </li>

        </Route>
        <Route path="/signup">
          <li className="header__nav">
            <Link to="/signin" className="header__sign">Войти</Link>
          </li>
        </Route>
      </ul>
    </header>
  );
}
export default Header;