import React, { Component } from 'react';
import './App.css';
import store from './store.js';

//this pane logs in and then immediately pulls the list of users from the server.
//on fail, it will ask to log in again and display a user friendly error message.
export class LoginPane extends Component {

    constructor(props) {
        super(props);
        this.updateLoginParams = this.updateLoginParams.bind(this);
        this.login = this.login.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.state = {
            display: 'flex'
        }
    }

    //method using rest API to get a list of users
    getUsers(there) {
        let that = there;
        there.props.callRest('GET', 'users', '', function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                try{
                    let newUsers = JSON.parse(this.responseText);
                    store.dispatch({type: 'update_users', newUsers: newUsers});
                    if (Array.isArray(newUsers)) {
                        that.setState({display: 'none'});
                    }
                    else {
                        alert('login failed');
                    }
                }
                catch(err){
                    alert('login failed!');
                    that.setState({display: 'flex'});
                }
            }
        });
    }

    //method to log in using rest API
    login() {
        return new Promise((resolve, reject) => {
            if (!store.getState().loginToken) {
                try {
                    this.props.callRest('POST', 'auth/login', JSON.stringify({loginMode: 1, username: store.getState().username, password: store.getState().password}), function() {
                        if (this.readyState === XMLHttpRequest.DONE) {
                            store.dispatch({type: 'update_token', token: this.getResponseHeader('X-MSTR-AuthToken')});
                            if (store.getState().loginToken) {
                                resolve();
                            }
                            else {
                                alert('login failed!');
                            }
                        }
                    });
                }
                catch(err) {
                    alert('login failed!');
                }
            }
        });
    }

    //dispatches an action with type (url, username, password) that calls an action to update
    //the store url/username/password respectively with the new value
    updateLoginParams(parameter, e){
        store.dispatch({type: parameter, loginParam: e.target.value});
    }

    //login button submission
    formSubmit(e){
        let that = this;
        e.preventDefault();
        this.login().then(() => this.getUsers(that));
    }

    render() {
        return (
            <div className="login-backdrop" style={{display: this.state.display}}>
                <div className="login-form">
                    <div className="panel-title">Log In</div>
                    <form onSubmit={this.formSubmit} style={{padding:'5px'}}>
                        <label>
                            {/*Login form sets login and url parameters for rest calls*/}
                            {/*store.getState().x gets the current value of the field 'x' in the store object*/}
                            <input type="text" placeholder='REST API URL' defaultValue={store.getState().url} onChange= {(e) => this.updateLoginParams("set_url", e)} /><br/>
                            <input type="text" placeholder='username' defaultValue={store.getState().username} onChange= {(e) => this.updateLoginParams("set_username", e)}/><br/>
                            <input type="password" placeholder='password' defaultValue={store.getState().password} onChange= {(e) => this.updateLoginParams("set_password", e)}/><br/>
                        </label>
                        <input type="submit" value="Login" />
                    </form>
                </div>
            </div>
        )
    }
}
