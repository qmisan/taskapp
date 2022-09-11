import React, { useState } from "react";
import classNames from "classnames";
import { markCompleted, deleteTask, updateTime, getTimeUsed } from "../utils.js";

// External components
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Timer from "react-timer-wrapper";
import Timecode from "react-timecode";

import Unchecked from "../assets/Unchecked.svg";
import TrashIcon from "../assets/Trash.svg"
import CheckboxActive from "../assets/CheckboxActive.svg";
import Checked from "../assets/Checked.svg";

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
  const [remainingTime, setRemainingTime] = useState(0);
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
              <div className="progress-bar">
                <CircularProgressbarWithChildren value={(duration - time) / duration}>
                  <h3>
                    <Timer active={timerActive} duration={duration} onTimeUpdate={onTimerUpdate} onFinish={onFinish} />
                    <Timecode time={duration - time} format="mm:ss" />
                  </h3>
                </CircularProgressbarWithChildren>
              </div>
              <div>
                <StopButton onClick={stopTimer} />
              </div>
              <div className="delete-button" onClick={handleDelete}><img src={TrashIcon} alt="delete" /></div>
            </div>
          )}
          {!timerActive && (
            !oldTimerActive ?
              <StartButton onClick={startTimer} /> :
              <ContinueClearButton onContinueClick={continueTimer} onResetClick={resetTimer} />
          )}

        </div>
      )}
      {completed && (
        <div className="delete-button" onClick={handleDelete}><img src={TrashIcon} alt="delete" /></div>
      )}
    </div>
  );
}

export default TaskListItem;