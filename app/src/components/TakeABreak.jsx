import React, { useState, Fragment, useEffect } from "react";
import * as _ from "underscore";

import Meditation from "../assets/pixeltrue_meditation_1.svg";
import Yoga from "../assets/pixeltrue_yoga_2.svg";
import { getMindfullnessPractices, getActivityBreaks } from "../utils.js";

function Practice({ practice }) {
  function goToPractice() {
    //todo
  }

  const Image = practice.type === "mindfullness" ? Meditation : Yoga;

  return (
    <div className="practice-card">
      <img src={Image} alt={practice.name} />
      <h4>{practice.title}</h4>
      <span>{practice.description}</span>
      <span className="caption">{practice.duration + " min"}</span>
      <button className="play-practice-button" onClick={goToPractice}><i data-eve="" />{"Play"}</button>
    </div>
  );
}

export function TakeABreak() {
  const [mindfullness, setMindfullness] = useState([]);
  const [breaks, setBreaks] = useState([]);

  useEffect(() => {
    getMindfullnessPractices().then(data => setMindfullness(data));
    getActivityBreaks().then(data => setBreaks(data));
  }, []);

  return (
    <Fragment>
      <div className="take-a-break">
        <div className="container">
          <div className="practice-category">
            <h3>{"Mindfullness"}</h3>
            <div className="practices">
              {_.map(mindfullness, (practice, i) => {
                return (
                  <Practice practice={practice} key={i} />
                );
              })}
            </div>
          </div>
          <div className="practice-category">
            <h3>{"Activity breaks"}</h3>
            <div className="practices">
              {_.map(breaks, (practice, i) => {
                return (
                  <Practice practice={practice} key={i} />
                );
              })}
            </div>
          </div>
        </div>
      </div>  
    </Fragment>
  );
}