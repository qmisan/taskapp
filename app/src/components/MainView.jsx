import React, { Fragment, useEffect, useState } from "react";
import * as _ from "underscore";
import AaltoLogo from "../assets/A_essentials_logo.svg";

import { TakeABreak } from "./TakeABreak";
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
        <div className="aalto-logo">
          <img alt="aalto logo" src={AaltoLogo} />
        </div>
        <div className="navigation">
          <span onClick={() => setView("tasks")}>{"Tasks"}</span>
          <span onClick={() => setView("timer")}>{"Timer"}</span>
          <span onClick={() => setView("break")}>{"Take a break"}</span>
        </div>
      </div>
      {showTaskList && <TaskList user={user} />}
      {showTimer && <Task task={null} user={user} />}
      {showPractices && <TakeABreak />}
    </Fragment>
  );
}