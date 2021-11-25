import React, { Fragment, useState } from "react";
import Timer from "react-timer-wrapper";
import Timecode from "react-timecode";

export function TaskTimer({ timerOn }) {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(25 * 60 * 1000);

  function onTimerUpdate({time, duration}) {
    setTime(time);
    setDuration(duration);
  }

  function onFinish() {
    new Notification("Timer done!");
  }

  return (
    <Fragment>
      <Timer active={timerOn} duration={duration} onTimeUpdate={onTimerUpdate} onFinish={onFinish} />
      <Timecode time={duration - time} format="mm:ss" />
    </Fragment>
  );
}