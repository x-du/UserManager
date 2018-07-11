import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { RestLog } from './RestLog.js';
import { LoginPane } from './Login.js';
import store from './store.js'

class App extends Component {
    constructor(props) {
        super(props);

        //set context for all functions
        this.callRest = this.callRest.bind(this);
        this.updateUserId = this.updateUserId.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.renderPropertyValue = this.renderPropertyValue.bind(this);
        this.patchName = this.patchName.bind(this);

        //Wrote this without redux - state contains a login token, information about the selected users, and login
        //parameters for the api calls. Also a flag on whether or not to show the login div
        this.state = {
            selectedUserId: '',
            selectedUserInfo: {},
            newName: ''
        };
    }

    /*
        helper method for making rest api calls
        @param method: the HTTP request method(GET, POST, etc)
        @param endpoint: the API endpoint. Expected format: 'endpoint/'
        @param body: the body to be sent
        @param callback: callback function to be called onreadystatechange
    */
    callRest(method, endpoint, body, callback) {

        if (endpoint.startsWith('/')) {
            endpoint = endpoint.substr(1);
        }

        //create xhr request based on parameters passed into function
        let xhr = new XMLHttpRequest();
        xhr.open(method, store.getState().url + endpoint);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.withCredentials = true;
        let token = store.getState().loginToken;
        if (token) {
            xhr.setRequestHeader('X-MSTR-AuthToken', token);
        }
        xhr.onreadystatechange = callback;

        try {
            xhr.send(body);
        } catch (err) {
            console.log(err);
            alert('error: could not send http request');
        }
    }

    //UserEditor functions
    cleanPropertyName(prop) {
        //makes display of prop names nicer
        prop = prop.charAt(0).toUpperCase() + prop.substr(1);
        return prop.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
    }

    //handles a name change for the currently selected user
    patchName() {
        let uid = this.state.selectedUserInfo.id,
        patchBody = {
            operationList: [
                {
                    'op': 'REPLACE',
                    'path': '/fullName',
                    'value': this.state.newName
                }
            ]
        };

        //submits call to rest api for the name change
        this.callRest('PATCH', 'users/' + uid, JSON.stringify(patchBody), function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                alert('Name has been updated');
            }
        });

        //update user name in list
        const ukey = this.state.selectedUserId;
        const index = store.getState().users.findIndex(user => user.id === ukey);
        //as to not mutate state directly
        const users = store.getState().users;
        users[index].name = this.state.newName;
        store.dispatch({type: 'update_users', newUsers: users});
    }

    //changes name in state whne it is updated in the text box, calls patch when enter is pressed
    handleChangeName(e) {
        this.setState({newName : e.target.value});
        //on enter key press, make rest call to change selected user name
        if (e.key === 'Enter') {
            this.patchName();
        }
    }

    //Puts date into human-readable format, and changes name display to an input textbox
    renderPropertyValue(name, val) {
        //date formatting
        if (name.indexOf('date') >= 0) {
            try {
                return (new Date(val)).toLocaleString();
            } catch (e){} //ignore
        //name to input condition
        } else if (name === 'fullName') {
            return <input type='text' defaultValue={val} key={this.state.selectedUserInfo.id}
                          onChange = {this.handleChangeName} />;
        }
        return val;
    }
    //end of UE functions


    //changes selected user whenever a new user is clicked
    updateUserId(userId){
        this.setState({selectedUserId: userId});
        let me = this;

        if (userId) {
            this.callRest('GET', 'users/' + userId, '', function () {
                if (this.readyState === XMLHttpRequest.DONE) {
                    me.setState({selectedUserInfo: JSON.parse(this.responseText)});
                }
            });
        }
    }

    render() {
        //more UserEditor stuff
        const validProps = ["username", "fullName", "id", "abbreviation", "dateCreated", "dateModified"];
        let tableRows = [],
            userInfo = this.state.selectedUserInfo,
            headerDisplay = "none";
        if (userInfo && userInfo.id) {
            try {
                validProps.forEach(
                    (prop, i) => (userInfo[prop]) ? tableRows.push(<tr key={userInfo.id + i}>
                        <td>{this.cleanPropertyName(prop)}</td>
                        <td>{this.renderPropertyValue(prop, userInfo[prop])}</td>
                    </tr>):null
                )
                headerDisplay = "table";
            } catch (err) {
                console.log(err);
            }
        }
        //end of UE

        return (
          <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <span className="App-title">React User Manager</span>
                <img src={logo} className="App-logo" alt="logo" />
            </header>
              <div className="container">
                  <div className="fixed">
                      <div className="panel-title">
                          List of Users
                          <div className="subtitle">Select user below to get user information</div>
                      </div>
                      <ul>
                          {/*dynamic display for list of users*/}
                          {store.getState().users && Array.isArray(store.getState().users) && store.getState().users.length > 0 ?
                            (  store.getState().users.map(function(user){
                                    return <li className="user" key={user.id} onClick={() => this.updateUserId(user.id)}> {user.name} </li>;
                                }.bind(this))
                            ) : (<li>No users available</li>)}
                      </ul>
                  </div>
                  <div className="flex-item">
                        {/*User Form*/}
                      <div className="panel-title">
                        User Properties
                      </div>
                        <table className="user-editor" style={{display:headerDisplay}}>
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>{tableRows}</tbody>
                        </table>
                        <button className='submit-button user-editor' style={{display:headerDisplay}} onClick={this.patchName}>Update Name</button>

                    </div>

                    {/*Rest Call Log*/}
                    <div className="right-panel">
                        <div className="panel-title">REST Call Log</div>
                            <RestLog/>
                        </div>
                    </div>
                <LoginPane callRest={this.callRest}/>
            </div>
        );
      }
}

export default App;
