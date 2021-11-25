// taskRepository.js

export class UserTaskRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    console.log('Creating userTasks table...')
    const sql = `
      CREATE TABLE IF NOT EXISTS userTasks (
        userId INTEGER,
        taskId INTEGER,
        timer INTEGER DEFAULT 0,
        completed INTEGER DEFAULT 0,
        courseId INTEGER DEFAULT NULL,
        FOREIGN KEY (userId) REFERENCES user(id),
        FOREIGN KEY (taskId) REFERENCES task(id),
        FOREIGN KEY (courseId) REFERENCES courses(id),
        PRIMARY KEY (userId, taskId)
      )`
    return this.dao.run(sql)
  }

  create(userId, taskId, courseId=null, completed=0) {
    courseId = courseId === undefined ? null : courseId
    return this.dao.run(
      'INSERT INTO userTasks (userId, taskId, courseId, completed) VALUES (?, ?, ?, ?)',
      [userId, taskId, courseId, completed])
  }

  getAllTasksByUserId(userId) {
    return this.dao.all(
      `SELECT * FROM userTasks WHERE userId = ?`,
      [userId])
  }

  getByIds(userId, taskId) {
    return this.dao.get(
      `SELECT * FROM userTasks WHERE userId = ? AND taskId = ?`,
      [userId, taskId])
  }

  delete(userId, taskId) {
    return this.dao.run(
      `DELETE FROM userTasks WHERE userId = ? AND taskId = ?`,
      [userId, taskId]
    )
  }

  getAll() {
    return this.dao.all(`SELECT * FROM userTasks`)
  }

  changeComplete(userid, taskid, complete) {
    return this.dao.run(
      'UPDATE userTasks SET completed = ? WHERE userId = ? AND taskId = ?',
      [complete, userid, taskid]
    )
  }

  async increaseTimer(userId, taskId, timeToAdd) {
    
    const oldTime = await this.dao.get(
      `SELECT timer FROM userTasks WHERE userId = ? AND taskId = ?`,
      [userId, taskId]
    )
    
    const newTime = Number(oldTime.timer) + Number(timeToAdd)

    console.log("Updated time is: ", newTime)
    const ret_val = await this.dao.run(
      `UPDATE userTasks SET timer = ? WHERE userId = ? AND taskId = ?`,
      [newTime, userId, taskId]
    )
    return ret_val
  }
}