import React, { useState, Fragment } from "react";
import { TaskTimer } from "./TaskTimer";

export function Task({ task, user }) {
  const [timerOn, setTimerOn] = useState(false);
  const [pomodoroInProgress, setPomodoroInProgress] = useState(false);

  const stopStartButtonText = timerOn ? "Stop" : "Start";

  function toggleTimer() {
    setTimerOn(!timerOn);
  }

  return (
    <Fragment>
      <div className="task-view">
        <div className="container">
          <div className="timer">
            <h2>
              <TaskTimer user={user} task={task} timerOn={timerOn} />
            </h2>
            <button className="timer-button" onClick={toggleTimer}>
              <h2>{stopStartButtonText}</h2>
            </button>
          </div>
          {!!task && (
            <div className="task-info">
              <span>{task.name}</span>
              <span>{task.owner}</span>
              <span>{task.description}</span>
            </div>
          )}
        </div>
      </div>  
    </Fragment>
  );
}