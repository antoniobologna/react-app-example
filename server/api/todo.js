import express from 'express';
import config from '../config.json';
const router = express.Router();
import User from '../models/user';
import Todo from '../models/todo';
import {
  generateHash,
  findUserByEmail,
  userIsAuthenticated,
} from './utils';

/** Get all tasks from all org's todo lists */
router.get('/todos', (req, res) => {
  if(!userIsAuthenticated(req)) {
    return res.status(401).json({ error: 'not authorized' });
  }

  const { org } = req.session.user.data;

  //Change to return all non-private tasks, and all private ones from user.
  return Todo
    .find({
      org
    })
    .then(tasks => {
      return res.status(200).json({data: tasks});
    })
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) return res.status(400).json({err});
    return res.status(200).end();
  });
});

router.post('/login',
  (req, res) => {
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
