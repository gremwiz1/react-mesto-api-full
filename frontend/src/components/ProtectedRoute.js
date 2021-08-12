import React from 'react';
import { Redirect, Route } from 'react-router-dom';
const ProtectedRoute = ({ loggedIn, ...routeProps }) => {
    return loggedIn ? <Route {...routeProps} /> : <Redirect to="/sign-in" />;
};
export default ProtectedRoute;