# React User Manager
This sample project demonstrates how REST API calls work with ReactJS and showcases a React component that can be used to display a log of all REST API calls.

![App Screenshot](https://github.com/MicroStrategy/UserManager/blob/master/readmeImages/UM_1.png)

## Understanding the API workflow
This React project authenticates a user, retrieves and displays a list of users linked to a specific REST server, and allows the authenticated user to view and edit data for a user selected from the list. It also displays a log of all REST API calls that are made while the project is in use.

  #### 1. POST /auth/login

  This REST API authenticates a user. It creates a MicroStrategy session using credentials for the user and a specified authorization mode. It returns an authToken, which will be used by subsequent REST API calls. I

  #### 2. GET /users/

  This REST API returns a list of users belonging to the Intelligence Server that is used by the project.

  #### 3. GET /users/{userId}

  This REST API returns a single user, from the list of users, based on the user ID.

  #### 4. PATCH /users/{userId}

  This REST API makes a partial change to a single user, from the list of users, based on the user ID.

## Setting up the sample
To set up the sample:

#### 1. Install node.js if you have not already done so.
#### 2. Download the compressed file containing the sample project provided for you and extract the contents to your local machine.

The extracted folder containing the sample is called ReactUserMangerSample, and it contains the following folders and files:

   - **src**
      - This folder contains all the javascript code for the sample, as well as CSS and image files (.png and .svg).

   - **package.json**/**package-lock.json**
      - This is the node.js configuration/dependency file.

   - **public**
      - This is the default public folder that is generated when a React app is created.

#### 3. Configure the node dependencies.

   - Open a Command Prompt window in Windows or a Terminal in Mac.
   
   - Install the required node modules
   
   - Navigate to the project location and run npm install.

Leave the Command Prompt window or Terminal open. After you have configured the sample, you will use this window to start the app.

## Configuration required for cross origin in Library:
#### 1. If you have not already done so, deploy the MicroStrategyLibrary web application locally or in a Cloud instance.
#### 2. Configure Library to enable cross origin for the REST server.
  - Navigate to `MicroStrategyLibrary/WEB-INF/classes/config/configOverride.properties`.
  - Open configOverride.properties and set `auth.cors.origins=*`.
#### 3. Restart the web server.
#### 4. Navigate to the sample and open store.js. It includes the following code:
```
...
  const DEFAULT_USERNAME = 'enter your user name';

  const DEFAULT_PASSWORD = 'enter your password';

  const DEFAULT_REST_SERVER = 'http://your MicroStrategy Library server name and port/consume-dev/api/';

  const initState = {users: null, username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD, url: DEFAULT_REST_SERVER, loginToken: null};

  const store = createStore(reducer, initState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
...
```
#### 5. Make the following changes:

- Enter the **username** you want to log in with as the value of the `DEFAULT_USERNAME` constant.
- Enter the **password** you want to log in with as the value of the `DEFAULT_PASSWORD` constant.
- Enter the **name** and **port** for your MicroStrategy Library installation in the path for the `DEFAULT_REST_SERVER` constant.

#### 6.Save your changes.

# Using the sample
#### 1. In a Command Prompt window in Windows or terminal in Mac, `run npm start` from inside the sample project folder.
#### 2. The React User Manager app opens in your browser ( http://localhost:3000), covered by a login page.

   - On the left of the app is a section for a List of Users, where users that belong to the Intelligence Server linked to the project will be displayed
   - In the middle is a section where User Properties for a user selected from the list will be displayed. This information can be edited and saved.
   - On the right is the REST Call Logsection where REST API calls will be listed as they are made, beginning with authentication.
#### 3. Confirm that the user name and password on the login page are correct and click the log in button.
The app pulls the list of users from the Intelligence Server and displays them under List of Users on the left.
![](https://github.com/MicroStrategy/UserManager/blob/master/readmeImages/UM_2.png)
#### 4. Under User Properties, click on a specific user to display properties for that user.
 You can change the name in the text box. When you press Enter, the user properties are updated.
![](https://github.com/MicroStrategy/UserManager/blob/master/readmeImages/UM_3.png)
#### 5. Beginning with authentication, the REST API call for each action that is performed is logged on the right under REST Call Log.
![](https://github.com/MicroStrategy/UserManager/blob/master/readmeImages/UM_4.png)


