export async function getTasks(user) {
  let url = new URL("http://localhost:8000/getTasks");
  let params = { userId: user.id };
  url.search = new URLSearchParams(params).toString();

  let response = await fetch(url);
  let data = await response.json();
  return data;
}

export async function getUsers() {
  let url = new URL("http://localhost:8000/getUsers");
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

export async function getMindfullnessPractices() {
  let url = new URL("http://localhost:8000/getPracticeByType");
  let params = { practiceType: "mindfullness" };
  url.search = new URLSearchParams(params).toString();

  let response = await fetch(url);
  let data = await response.json();
  return data;
}

export async function getActivityBreaks() {
  let url = new URL("http://localhost:8000/getPracticeByType");
  let params = { practiceType: "activity" };
  url.search = new URLSearchParams(params).toString();

  let response = await fetch(url);
  let data = await response.json();
  return data;
}

export async function getCourseByTask(courseId) {
  let url = new URL("http://localhost:8000/getCourse");
  let params = { courseId: courseId };
  url.search = new URLSearchParams(params).toString();

  let response = await fetch(url);
  let data = await response.json();
  return data;
}

export async function markCompleted(user, task, completed) {
  return new Promise(function (resolve, reject) {
    const XHR = new XMLHttpRequest();

    let urlEncodedDataPairs = [];
    urlEncodedDataPairs.push( encodeURIComponent( "userId" ) + '=' + encodeURIComponent( user.id ) );
    urlEncodedDataPairs.push( encodeURIComponent( "taskId" ) + '=' + encodeURIComponent( task.taskId ) );
    urlEncodedDataPairs.push( encodeURIComponent( "completed" ) + '=' + encodeURIComponent( completed ) );
    let urlEncodedData = urlEncodedDataPairs.join( '&' ).replace( /%20/g, '+' );

    XHR.open( 'POST', 'http://localhost:8000/completeTask' );
    XHR.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    XHR.onload = function () {
      if (this.status >= 200 && this.status < 300) {
          resolve(XHR.response);
      } else {
          reject({
              status: this.status,
              statusText: XHR.statusText
          });
      }
    };
    XHR.send( urlEncodedData );
  }); 
}

export async function addTask(formData) {
  return new Promise(function (resolve, reject) {
    const XHR = new XMLHttpRequest();

    let urlEncodedData = "",
      urlEncodedDataPairs = [],
      name;

    for (name in formData) {
      urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(formData[name]));
    }

    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    XHR.open('POST', 'http://localhost:8000/addTask');
    XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    XHR.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(XHR.response);
      } else {
        reject({
          status: this.status,
          statusText: XHR.statusText
        });
      }
    };
    XHR.send(urlEncodedData);
  });
}

export async function updateTime(user, task, time) {
  return new Promise(function (resolve, reject) {
    const XHR = new XMLHttpRequest();

    let urlEncodedDataPairs = [];
    urlEncodedDataPairs.push( encodeURIComponent( "userId" ) + '=' + encodeURIComponent( user.id ) );
    urlEncodedDataPairs.push( encodeURIComponent( "taskId" ) + '=' + encodeURIComponent( task.taskId ) );
    urlEncodedDataPairs.push( encodeURIComponent( "timeToAdd" ) + '=' + encodeURIComponent( time ) );
    let urlEncodedData = urlEncodedDataPairs.join( '&' ).replace( /%20/g, '+' );

    XHR.open( 'POST', 'http://localhost:8000/updateTime' );
    XHR.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    XHR.onload = function () {
      if (this.status >= 200 && this.status < 300) {
          resolve(XHR.response);
      } else {
          reject({
              status: this.status,
              statusText: XHR.statusText
          });
      }
    };
    XHR.send( urlEncodedData );
  }); 
}

export function getTimeUsed( milliseconds ) {
  var day, hour, minute, seconds;
  seconds = Math.floor(milliseconds / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;

  if (!day && !hour && !minute)
  {
    return "<1min";
  }
  else
  {
    let strD = day ? day + " days " : "";
    let strH = hour ? hour + "h " : "";
    let strM = minute ? minute + "min" : "";
  
    return  strD + strH + strM;
  }
}