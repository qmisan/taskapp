// practiceRepository.js

export class PracticeRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    console.log('Creating practices table...')
    const sql = `
          CREATE TABLE IF NOT EXISTS practices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            imgpath TEXT,
            description TEXT,
            duration INT,
            type TEXT
          )`
    return this.dao.run(sql)
  }

  create(title, imgpath, description, duration, type) {
    return this.dao.run(
      'INSERT INTO practices (title, imgpath, description, duration, type) VALUES (?, ?, ?, ?, ?)',
      [title, imgpath, description, duration, type])
  }

  getAll() {
    return this.dao.all(`SELECT * FROM practices`)
  }

  getByType(type) {
    return this.dao.all(
      `SELECT * FROM practices WHERE type = ?`,
      [type])
  }
}