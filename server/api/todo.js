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
  if (!userIsAuthenticated(req)) {
    return res.status(401).json({ error: 'not authorized' });
  }

  const { org } = req.session.user.data;

  //Change to return all non-private tasks, and all private ones from user.
  return Todo
    .find({
      org,
    })
    .then(tasks => {
      return res.status(200).json({ data: tasks, });
    })
});

/** Post new todo */
router.post('/', (req, res) => {
  if (!userIsAuthenticated(req)) {
    return res.status(401).json({ error: 'not authorized', });
  }

  const { body } = req.body;
  const { org, id } = req.session.user.data;

  const todo = new Todo({
    user: id,
    org,
    body,
  });

  return todo.save((err, task) => {
    if (err) {
			return res.status(500).json({ err });
		}

    return res.status(200).json({ data: task, });
  });
});

/** Delete selected task */
router.delete('/:id', (req, res) => {
  if (!userIsAuthenticated(req)) {
    return res.status(401).json({ error: 'not authorized', });
  }

  // allow users to delete from other users as well
  // const { id: userId } = req.session.user.data;
  const { id } = req.params;

  // Change to return all non-private tasks, and all private ones from user.
  return Todo
    .findOneAndRemove({  _id: id, })
    .then(doc => {
      return res.status(200).end();
    });
});

/** marks a task done/not done */
router.patch('/:id', (req, res) => {
  if (!userIsAuthenticated(req)) {
    return res.status(401).json({ error: 'not authorized' });
  }

  // allow users to delete from other users as well
  // const { id: userId } = req.session.user.data;
  const { id } = req.params;

  return Todo.findOne({ _id: id, }, (err, task) => {
    task.done = !task.done;

    return task.save((err, updatedTask) => {
      if (err) {
        return res.status(500).json({err})
      }

      return res.status(200).end()
    });
  });
});

module.exports = router;
