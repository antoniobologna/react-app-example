import crypto from 'crypto';
import config from '../config.json';
import User from '../models/user';

const generateHash = () => {
	return crypto.createHmac('sha256', config.crypto.secret)
		           //.update(Date.now().toString())
		           .digest('hex');
};

const userExists = (email) => {
  return User.findOne({email})
    .then(user => {
      if(user) {
				return true
			}

			return false
    })
    .catch(err => {
      return false
    })
};

const findUserByEmail = (email) => {
  return User.findOne({email})
    .then(user => {
      if(!user) throw new Error()

      return user
    })
    .catch(err => {
      return null
    });
};

/**
 * returns current user information
 */
const getCurrentUser = (req) => {
	const { data } = req.session.user;

  return data;
};

/**
 * determines if user is authenticated
 */
const userIsAuthenticated = (req) => {
  const { user } = req.session;
  return user && user.authenticated;
};

/**
 * determines if user is authenticated and is admin
 */
const isAdmin = (req) => {
  const { user } = req.session;
  return userIsAuthenticated(req) && user.data.admin;
};

/**
 * populates the user session
 */
const populateSession = (user, {session}) => {
  const { admin, id, auth, verified, name, email, revoked} = user;

  session.user = {
    authenticated: true,
    data: {
      id,
      admin,
      verified,
      name,
      email,
      revoked,
    }
  };
};

export {
	findUserByEmail,
	generateHash,
	getCurrentUser,
	isAdmin,
	populateSession,
	userExists,
	userIsAuthenticated,
};
