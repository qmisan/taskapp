import React, { Fragment, useState, useEffect } from "react";
import * as _ from "underscore";

// Components
import TaskListItem from "./TaskListItem"

import Plus from "../assets/plus.svg";
import Unchecked from "../assets/Unchecked.svg";

import { getTasks, addTask } from "../utils.js";

function AddNewTask({ user, loadTasks, onCancel }) {
  const [formData, setFormData] = useState({ name: "", description: "", userId: user.id });

  function handleInput(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  }

  async function handleAddNewTask(e) {
    e.preventDefault();
    await addTask(formData);
    await loadTasks();
    onCancel();
  }

  return (
    <div className="new-task-information">
      <div className="checkbox"><img src={Unchecked} alt="unchecked" /></div>
      <form onSubmit={handleAddNewTask}>
        <div className="new-task-fields">
          <input type="text" name="name" placeholder="Task title" onChange={handleInput} />
        </div>
        <button className="cancel" onClick={onCancel}>{"Cancel"}</button>
        <button type="submit">{"Add"}</button>
      </form>
    </div>
  )
}




function Tasks({ user, tasks, loadTasks }) {
  return (
    <Fragment>
      <div className="task-list">
        {_.map(tasks, (task, i) => {
          return (
            <TaskListItem user={user} task={task} loadTasks={loadTasks} key={i} />
          );
        })}
      </div>
    </Fragment>
  )
}

export function TaskList({ user }) {
  const [showAddNew, setShowAddNew] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [unfinishedTasks, setUnfinishedTasks] = useState([]);
  const hasTasks = unfinishedTasks.length > 0;
  const hasTasksMessage = hasTasks ? "Here are your most important tasks for today" : "Congratulations! You've done it all.";

  useEffect(() => {
    loadTasks();
  }, [user])

  useEffect(() => {
    setCompletedTasks(_.filter(allTasks, task => { return task.completed == 1 }));
    setUnfinishedTasks(_.filter(allTasks, task => { return task.completed == 0 }));
  }, [allTasks])

  async function loadTasks() {
    getTasks(user).then(data => {
      setAllTasks(data);
    });
  }

  const completedTasksCount = completedTasks.length;
  const hasFinishedTasks = completedTasksCount > 0;
  const completedMessage = hasFinishedTasks ? "Completed tasks" : "";

  return (
    <Fragment>
      <div className="welcome-view">
        <div className="container">
          <div className="left-column">
            <div className="add-task">
              <button className="add-button" onClick={() => setShowAddNew(!showAddNew)}>
                <img src={Plus} />
                <span>{"Create new task"}</span>
              </button>
              {showAddNew && <AddNewTask user={user} loadTasks={loadTasks} onCancel={() => setShowAddNew(false)} />}
            </div>
            {hasTasks && <Tasks tasks={unfinishedTasks} user={user} loadTasks={loadTasks} />}
          </div>
          <div className="right-column">
            <h4>{completedMessage}</h4>
            {hasFinishedTasks && <Tasks tasks={completedTasks} user={user} loadTasks={loadTasks} />}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default TaskList;