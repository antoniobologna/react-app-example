import express from 'express';
import config from '../config.json';
const router = express.Router();
import User from '../models/user';
import Todo from '../models/todo';
import {
  userIsAuthenticated,
} from './utils';

/** Get all tasks from all org's todo lists */
router.get('/', (req, res) => {
  if(!userIsAuthenticated(req)) {
    return res.status(401).json({ error: 'not authorized' });
  }

  const { org } = req.session.user.data;

  //Change to return all non-private tasks, and all private ones from user.
  return Todo
    .find({
      org,
    })
    .then(tasks => {
      return res.status(200).json({data: tasks});
    })
});

module.exports = router;
