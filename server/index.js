import express from 'express';
import config from './config.json';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import logger from 'morgan';
import RateLimit from 'express-rate-limit';
import WebSocketServer from './websocket';
import session from 'express-session';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import cookieParser from 'cookie-parser';
import http from 'http'

import auth from './api/auth'
import todo from './api/todo'

const app = express();
const router = express.Router();
const apiLimiter = new RateLimit(config.api_rate_limit);
const MongoStore = require('connect-mongo')(session);

/** Database related configuration and init. */
mongoose.Promise = bluebird
mongoose.connect(config.database_uri)
mongoose.connection.on('error', () => { console.log('Database connection error') })

/** Let's define some response headers */
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,PATCH,OPTIONS');
  res.header(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
  next();
});

/** Helmet options and configuration */
app.use(helmet());
app.use(helmet.noCache());
//app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'none'"],
		imgSrc: ["'self'", 'data:'],
		objectSrc: ["'none'"]
  }
}));

/** Generic use of morgan logs and properly parse and encode JSON */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.session.secret))
app.use(session(Object.assign(
	{},
	config.session,
	{
		store: new MongoStore({
			mongooseConnection: mongoose.connection
		})
	}
)))

/** Create HTTP server. */
const server = http.createServer(app);

/** Let's create the websocket server */
const webSocketServer = new WebSocketServer(server);

/** Start using routes */
app.use('/auth', auth);
app.use('/todos', todo);

/** Finally let's serve on specified port */
server.listen(config.port, err => {
  if (err) {
    return console.log('something bad happened', err);
  }

	console.log(`Server version ${config.version} started on port ${config.port}`);
});
