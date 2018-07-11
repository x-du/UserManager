import { createStore } from 'redux';

const reducer = function (state, action) {
    switch (action.type) {
        case 'update_users':
            return Object.assign({}, state, {users: action.newUsers});
        case 'update_token':
            return Object.assign({}, state, {loginToken: action.token});
        case 'set_url':
            return Object.assign({}, state, {url: action.loginParam});
        case 'set_username':
            console.log(action);
            return Object.assign({}, state, {username: action.loginParam});
        case 'set_password':
            return Object.assign({}, state, {password: action.loginParam});
        default:
            return state;
    }
}

const DEFAULT_USERNAME = 'tester_qfan';
const DEFAULT_PASSWORD = 'test';
const DEFAULT_REST_SERVER = 'http://localhost:8081/web-dossier-11.0.0.11522/api/';
const initState = {users: null, username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD, url: DEFAULT_REST_SERVER, loginToken: null};

const store = createStore(reducer, initState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
