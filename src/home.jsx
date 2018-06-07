/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import constants from './constants';
import { globalParameters } from './utils';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  authForm: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  error: {
    color: theme.palette.text.red,
  },
  welcome: {
    textAlign: 'center',
  },

  formControl: {
    flex: 1,
    margin: theme.spacing.unit,
  },

  striked: {
    textDecoration: 'line-through',
  },
  todo: {
    listStyle: 'none',
  },
  task: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  newTask: {
    display: 'flex',
  },
  taskBody: {

  },
  taskTime: {
    color: theme.palette.text.gray,
  },
});

class Home extends Component {
  state = {
    todoCount: 0,
    todo: [],
    taskDescription: '',
  }

  componentDidMount() {
    this.fetchAllTasks().then(todo => {
      this.setState({ todoCount: todo.length, todo, })
    });
  }

  /**
   * @function handleTaskAdd Adds a new task to the todo list.
   *
   * @returns {object} Promise from setState.
   */
  handleTaskAdd = () => {
    const { taskDescription, } = this.state;
    let newTodoList = [...this.state.todo];

    return fetch(constants.api.todo, globalParameters('POST', { body: taskDescription, }))
      .then(response => response.json())
      .then(response => {
        if(response.data) {
          newTodoList.push({
            ...response.data,
          });

          return this.setState({ todo: newTodoList });
        }
      })
      .catch(err => {
        return console.log({err});
      })
  }

  /**
   * @function handleTaskChange Marks as done or not done a task.
   * @param taskID {string} task's unique ID.
   *
   * @returns {object} Promise from setState.
   */
  handleTaskDelete = (taskID) => {
    let newTodoList = [...this.state.todo];

    return fetch(constants.api.todo + taskID, globalParameters('DELETE'))
      .then(response => {
        if(response.ok) {
          newTodoList = newTodoList.filter(task => task._id !== taskID);

          return this.setState({ todo: newTodoList });
        }
      })
  }

  /**
   * @function handleTaskDelete Deletes a task.
   * @param taskID {string} task's unique ID.
   *
   * @returns {object} Promise from setState.
   */
  handleTaskChange = (taskID) => {
    let newTodoList = [...this.state.todo];

    return fetch(constants.api.todo + taskID, globalParameters('PATCH'))
      .then(response => {
        if(response.ok) {
          const taskIndex = newTodoList.findIndex(task => task._id === taskID);
          newTodoList[taskIndex].done = !newTodoList[taskIndex].done;

          return this.setState({ todo: newTodoList });
        }
      })
  }

  /**
   * @function getTodo
   *
   * @returns {Map {DOM}} Map of List Items containing tasks.
   */
  getTodo() {
    const { classes, } = this.props;
    const { todo, } = this.state;

    return todo.map((task, key) => (
      <div key={key}>
        <ListItem button className={classes.task}>
          <Switch
            checked={ task.done }
            onChange={() => this.handleTaskChange(task._id)}
            value="task"
            color="primary"
          />
          <ListItemText
            className={task.done? classes.striked : ""}
            primary={ task.body }
            secondary={ task.created_at }
          />
          <Button
            variant="fab"
            aria-label="delete"
            className={classes.button}
            onClick={() => this.handleTaskDelete(task._id)}>
            <DeleteIcon />
          </Button>
        </ListItem>
        <Divider light />
      </div>
    ));
  }

  fetchAllTasks = () => (
    fetch(constants.api.todo, globalParameters())
      .then(response => response.json())
      .then(({ data }) => data)
  )

  handleNewTaskChange = (event) => {
    const { name, value, } = event.target;

    this.setState({ [name]: value })
  }

  render() {
    const { classes, user } = this.props;
    const { todoCount } = this.state;

    if(user) {
      return (
        <div className={classes.root}>
          <Grid container spacing={24} justify="center">
            <Grid item xs={12} sm={12}>
              <div className={classes.welcome}>
                <h1>Welcome back, {user.name}</h1>
                <div>
                  You have { todoCount } tasks in your team's todo.
                </div>
              </div>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Paper className={classes.paper}>
                <List component="nav">
                  <ListItem button className={classes.newTask}>
                    <FormControl className={classes.formControl} aria-describedby="taskDescriptionText">
                      <InputLabel htmlFor="taskDescription">New Task</InputLabel>
                      <Input name="taskDescription" value={this.state.taskDescription} onChange={this.handleNewTaskChange} />
                      <FormHelperText id="taskDescriptionText">Add new task (up to 100 characters)</FormHelperText>
                    </FormControl>
                    <Button
                      variant="fab"
                      aria-label="add"
                      className={classes.button}
                      color="primary"
                      onClick={this.handleTaskAdd}>
                      <AddIcon />
                    </Button>
                  </ListItem>
                  { this.getTodo() }
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      );
    }

    return null
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default withStyles(styles)(Home);
