import React, { Fragment, useEffect, useState } from "react";
import * as _ from "underscore";

import { Task } from "./Task";
import { TaskList } from "./TaskList";

export function MainView({ user }) {
  const [view, setView] = useState("tasks");

  const showTaskList = view === "tasks";
  const showTimer = view === "timer";
  const showPractices = view === "break";

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
      </div>
      {showTaskList && <TaskList user={user} />}
      {showTimer && <Task task={null} user={user} />}
    </Fragment>
  );
}