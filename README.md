# React User Manager
This sample project demonstrates how REST API calls work with ReactJS and showcases a React component that can be used to display a log of all REST API calls.

# Configuration required for cross origin in Library:
Set `auth.cors.origins=*` in MicroStrategyLibrary/WEB-INF/classes/config/configOverride.properties to enable cross origin for rest server.

# File list
- src : src folder containing all the javascript code
- package.json : node.js configuration/dependency file
- public : default public folder created when a react app was created 
- gitignore
- readme.md

# Installation instructions
1. Install node.js if you haven't done so already. https://nodejs.org/en/download/ 
2. Download the zip file and unzip the file into your local directory
3. Install node modules. Navigate to the project location in your terminal and run `npm install`
3. Run App. In your terminal and run `npm start`
5. Open your browser and go to http://localhost:3000 to view the App

# Usage instructions
By default, the project will attempt to use the api bound to MicroStrategyLibrary running on a localhost tomcat server, with a username of "admin" and a blank password. To change these settings, simply click the settings wheel next to the user properties header.

Once you click the log in button, the sample will attempt to pull a list of users and display them in a list on the right. A user can be clicked on to display user properties, and once the user properties show, the name can be changed in the text box and will update once 'enter' is pressed.

The REST API calls for all of these actions will be logged on the left.
