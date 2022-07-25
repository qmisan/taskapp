import React, { Fragment, useEffect, useState } from "react";
import * as _ from "underscore";

import { Task } from "./Task";
import { TaskList } from "./TaskList";

export function MainView({ user }) {
  const [view, setView] = useState("tasks");

  const showTaskList = view === "tasks";
  const showTimer = view === "timer";

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }, [])

  return (
    <Fragment>
      <div className="header">
        <div className="panel">
          <div className="title">
            <h1>TaskApp</h1>
          </div>
          {/* <div className="nav-bar">
          <ul className="nav-panel">
          <li>Settings</li>
          </ul>
        </div> */}
        </div>
      </div>
      {showTaskList && <TaskList user={user} />}
      {showTimer && <Task task={null} user={user} />}
    </Fragment>
  );
}