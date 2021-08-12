import {BASE_URL} from './utils.js';
const handleResponse = (response) => {
    if(response.ok) return response.json();
    else return Promise.reject(response.status);
}
export const register = ({email, password}) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "password": password,
            "email": email 
        })
    }).then((res) => handleResponse(res));
}
export const authorize = ({email, password}) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "password": password,
            "email": email 
        })
    }).then((res) => handleResponse(res));
}
export const getContent = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    }).then((res) => handleResponse(res));
}