// courseRepository.js

export class CourseRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    console.log('Creating course table...')
    const sql = `
        CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE)`
    return this.dao.run(sql)
  }

  create(name) {
    return this.dao.run(
      'INSERT INTO courses (name) VALUES (?)',
      [name])
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM courses WHERE id = ?`,
      [id])
  }

  getByName(name) {
    return this.dao.get(
      `SELECT * FROM courses WHERE name = ?`,
      [name])
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM courses WHERE id = ?`,
      [id]
    )
  }

  getAll() {
    return this.dao.all(`SELECT * FROM courses`)
  }

}