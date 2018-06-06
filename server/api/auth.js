import express from 'express';
import config from '../config.json';
const router = express.Router();
import PasswordHash from 'password-hash-and-salt';
import User from '../models/user';
import {
  generateHash,
  findUserByEmail,
  userIsAuthenticated,
  populateSession,
} from './utils';

router.get('/isAuth', (req, res) => {
  const { user } = req.session;
  return res.json({data: user? true:false});
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) return res.status(400).json({err});
    return res.status(200).end();
  });
});

router.post('/login', (req, res) => {
  if(userIsAuthenticated(req)) {
    return res.status(200).end();
  }

  const { email, password } = req.body;

  return findUserByEmail(email).then(user => {
    if(!user || user.revoked) {
      return res.status(401).json({ error: 'user is not authorized' });
    }

    return PasswordHash(password).verifyAgainst(user.password, (err, verified) => {
      if(err || !verified) {
        return res.status(401).json({ error: 'not authorized' });
      }

      populateSession(user, req);
      return res.status(200).end();
    });
  });
});

router.post('/revoke', (req, res) => {
  if(!userIsAuthenticated(req)) {
    return res.status(401).json({ error: 'not authorized' });
  }

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const { password } = req.body;
  const { email } = req.session.user.data;

  return findUserByEmail(email).then(user => {
    if(!user) {
      return res.status(401).json({ error: 'user is not valid' });
    }

    PasswordHash(password).verifyAgainst(user.auth.password, (err, verified) => {
      if(err || !verified) {
        return res.status(401).json({ error: 'not authorized' });
      }

      const updatedUser = {
        revoked: true,
        updated_at: Date.now()
      };

      return User.update({email}, updatedUser).then(() => {
        req.session.destroy(err => {
          if(err) return res.status(400).json({err});
          return res.status(200).end();
        });
      }).catch(err => {
        return res.status(500).json({err});
      });
    });
  });
});

module.exports = router;
