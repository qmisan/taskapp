import React, { Fragment, useState, useEffect } from "react";
import * as _ from "underscore";
import classNames from "classnames";

import Timer from "react-timer-wrapper";
import Timecode from "react-timecode";

import Checked from "../assets/Checked.svg";
import Unchecked from "../assets/Unchecked.svg";
import CheckboxActive from "../assets/CheckboxActive.svg";
import Plus from "../assets/plus.svg";
import TrashIcon from "../assets/Trash.svg"

import { getTasks, markCompleted, addTask, deleteTask, updateTime, getTimeUsed } from "../utils.js";

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
          <input type="text" name="description" placeholder="Description" onChange={handleInput} />
        </div>
        <button className="cancel" onClick={onCancel}>{"Cancel"}</button>
        <button type="submit">{"Add"}</button>
      </form>
    </div>
  )
}

function StartButton(props) {
  return (
    <button className={"task-timer-start"} onClick={props.onClick}>
      Start
    </button>
  );
}

function StopButton(props) {
  return (
    <button className={"task-timer-stop"} onClick={props.onClick}>
      Stop
    </button>
  );
}

function ContinueClearButton(props) {
  return (
    <div className="task-timer-continue-reset">
      <button className={"task-timer-continue"} onClick={props.onContinueClick}>
        Continue
      </button>
      <button className={"task-timer-reset"} onClick={props.onResetClick}>
        Reset
      </button>
    </div>
  )
}

function TaskListItem({ user, task, loadTasks }) {
  const [timerActive, setTimerActive] = useState(false);
  const completed = task.completed === 1;
  const showTimeUsed = !timerActive && task.timer > 0;
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(25 * 60 * 1000);
  const [isHovering, setIsHovering] = useState(false);
  const [oldTimerValue, setOldTimerValue] = useState(0);
  const [oldTimerActive, setOldTimerActive] = useState(false);

  async function markTaskComplete() {
    if (completed) {
      await markCompleted(user, task, 0);
    } else {
      await markCompleted(user, task, 1);
    }
    await loadTasks();
  }

  function startTimer() {
    setTimerActive(true);
    setDuration(25 * 60 * 1000);
  }

  async function stopTimer() {
    setTimerActive(false);
    setOldTimerActive(true);
    setOldTimerValue(time);
    if (!!task) {
      await updateTime(user, task, time);
      await loadTasks();
    }
  }

  function continueTimer() {
    setTimerActive(true);
    setTime(oldTimerValue);
    setDuration(duration - oldTimerValue);
    setOldTimerValue(0);
    setOldTimerActive(false);
  }

  function resetTimer() {
    setOldTimerValue(0);
    setOldTimerActive(false);
    setTime(0);
  }

  async function handleDelete() {
    await deleteTask(user, task);
    await loadTasks();
  }

  async function onFinish() {
    new Notification("Timer done!");
    await updateTime(user, task, time);
    await loadTasks();
  }

  function getCheckbox() {
    if (completed) {
      return <img src={Checked} alt="checked" />;
    } else if (timerActive) {
      return <img src={CheckboxActive} alt="active" />;
    } else {
      return <img src={Unchecked} alt="unchecked" />;
    }
  }

  function onTimerUpdate({ time, duration }) {
    setTime(time);
    setDuration(duration);
  }

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <div className={classNames("task-list-item", { "completed": completed, "active": timerActive })} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div className="checkbox" onClick={markTaskComplete}>{getCheckbox()}</div>
      <div className="task-info">
        <span>{task.name}</span>
        <span>{task.description}</span>
      </div>
      {!completed && (
        <div className={classNames("task-actions", { "active": timerActive })}>
          {showTimeUsed && (
            <p className="time-used">
              {"Time spent: " + getTimeUsed(task.timer)}
            </p>
          )}

          {timerActive && (
            <div className="timer-stop-div">
              <h3>
                <Timer active={timerActive} duration={duration} onTimeUpdate={onTimerUpdate} onFinish={onFinish} />
                <Timecode time={duration - time} format="mm:ss" />
              </h3>
              <StopButton onClick={stopTimer} />
            </div>
          )}
          {!timerActive && (
            !oldTimerActive ?
              <StartButton onClick={startTimer} /> :
              <ContinueClearButton onContinueClick={continueTimer} onResetClick={resetTimer} />
          )}

          <div className="delete-button" onClick={handleDelete}><img src={TrashIcon} alt="delete" /></div>
        </div>
      )}
      {completed && (
        <div className="delete-button" onClick={handleDelete}><img src={TrashIcon} alt="delete" /></div>
      )}
    </div>
  );
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
  const message = hasTasks ? "Here are your most important tasks for today" : "Congratulations! You've done it all.";

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
