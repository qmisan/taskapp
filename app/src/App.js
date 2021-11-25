import React, { useState, useEffect } from "react";
import * as _ from "underscore";
import * as eva from "eva-icons";

import './styles/App.css';
import { getUsers } from "./utils.js";
import { MainView } from './components/MainView';

function App() {
  const [users, setUsers] = useState();
  const [user, setUser] = useState();
  // const [username, setUsername] = useState("");

  // function handleInput(e) {
  //   setUsername(e.target.value);
  // }
  
  useEffect(() => {
    eva.replace();
    getUsers().then(data => setUsers(data));
  }, [])

  function openApp(user) {
    setUser(user);
  }

  function renderContent() {
    if (user) {
      return <MainView user={user} />
    } else {
      return (
        <div className="user-list">
          {_.map(users, (user, i) => {
            return(
              <button key={i} onClick={() => openApp(user)}>{user.name}</button>
            );
          })}
        </div>
      );
    }
  }

  return(
    <article>
      {renderContent()}
    </article>

  )
}

export default App;
