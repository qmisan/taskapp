// userRepository.js

// Some dummy data

export class UserRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    console.log('Creating user table...')
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE)`
      return this.dao.run(sql)
    }
  
    create(name) {
      return this.dao.run(
        'INSERT INTO users (name) VALUES (?)',
        [name])
    }
  
    getById(id) {
      return this.dao.get(
        `SELECT * FROM users WHERE id = ?`,
        [id])
    }

    getByName(name) {
      return this.dao.get(
        `SELECT * FROM users WHERE name = ?`,
        [name])
    }
  
    delete(id) {
      return this.dao.run(
        `DELETE FROM users WHERE id = ?`,
        [id]
      )
    }
  
    getAll() {
      return this.dao.all(`SELECT * FROM users`)
    }
  }
