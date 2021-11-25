// taskRepository.js

export class TaskRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    console.log('Creating tasks table...')
    const sql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT
    )`
    return this.dao.run(sql)
  }

  create(name, description) {
    return this.dao.run(
      'INSERT INTO tasks (name, description) VALUES (?, ?)',
      [name, description])
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM tasks WHERE id = ?`,
      [id])
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM tasks WHERE id = ?`,
      [id]
    )
  }

  getAll() {
    return this.dao.all(`SELECT * FROM tasks`)
  }
}