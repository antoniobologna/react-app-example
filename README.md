# User Auth React App & Websocket NodeJS server Example #

## Objectives ##
The objective of this react app is to show a fast and easy approach to user authentication using React and a nodejs server.

## Technologies used ##
* React v16.x
* Webpack
* Babel & transformation plugins (see .babelrc for more info)
* NodeJS
* Websocket
* Redis
* Security (optional)
  * nsp - Optional but good to check for potential vulnerabilities in NPM packages.
  * Helmet - good practice to not disclose too much information to attackers.
  * RateLimit - Always good practice to rate limit requests against no availability and brute force attacks.
* eslint
* flow

## Why not just create-react-app? ##
I'm old school and somehow need to get into the configuration details, something that **create-react-app** hides pretty well.

## Requirements ##
* Mongodb v3.6.5
* NodeJS > v8.9.0
* Database test (you might want to pwd protected).

## Installation ##

Installing dependencies (front-end):

```
$ yarn install
```
or
```
$ npm install
```

Installing dependencies (server):

```
$ cd server
```

*same as front-end instructions*

Configuration file **config.json** containing database and other important configuration details.

```json
{
	"version": "0.1.0",
	"port": 3001,
	"api_rate_limit": {
		"windowMs": 100,
	  "max": 1,
	  "delayMs": 0
	},
	"crypto": {
    "secret": "Beam Me Up, Scotty"
  },
	"session": {
		"secret": ["xxxx"],
		"name": "xsid.secure",
		"resave": false,
	  "saveUninitialized": true,
		"unset": "destroy",
	  "cookie": {
			"httpOnly": true,
			"secure": false,
			"maxAge": 3600000,
			"sameSite": false
		}
	},
	"database_uri": "mongodb://127.0.0.1:27017/test",
	"db_user": "test",
	"db_pwd": "test"
}
```
