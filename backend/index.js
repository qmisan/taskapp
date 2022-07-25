
import { AppDAO } from './dao.js'
import { getTasksForUser } from './getTasks.js'
import { TaskRepository } from './taskRepository.js'
import { UserRepository } from './userRepository.js'
import { UserTaskRepository } from './userTaskRepository.js'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

// dummy data sources
import dummyUsersJSON from './dummy/dummyUsers.js'
import dummyTasksJSON from './dummy/dummyTasks.js'

const app = express()
const port = 8000

function createDB() {
  console.log('Initializing database...')
  return new AppDAO('./database.sqlite3')
}

// Database and table instances
const dao = createDB()
const taskRepo = new TaskRepository(dao)
const userRepo = new UserRepository(dao)
const userTaskRepo = new UserTaskRepository(dao)

// Create initial tables
await Promise.all([userRepo.createTable(), taskRepo.createTable()])
await userTaskRepo.createTable() // Needs User and tasks

// Fill usertable with dummydata
if ((await userRepo.getAll()).length === 0) {
  console.log('Filling users table with dummy data')
  for (const user of dummyUsersJSON) {
    await userRepo.create(user.name)
  }
}

// Fill tasks with dummydata
if ((await taskRepo.getAll()).length === 0) {
  console.log('Filling tasks table with dummy data')
  for (const task of dummyTasksJSON) {
    await taskRepo.create(task.name, task.description)
  }
}

if ((await userTaskRepo.getAll()).length === 0) {
  console.log('Filling userTasks table with dummy data')
  await Promise.all(dummyUsersJSON.map(async (user) => {
    const userId = (await userRepo.getByName(user.name)).id
    for (const taskId of user.tasks) {
      taskId === 1 ? userTaskRepo.create(userId, taskId, null, 1) : userTaskRepo.create(userId, taskId)
    }
  }))
}


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send({ 'Hello World!': "Hello" })
})

app.get('/getTasks', async (req, res) => {
  const userId = req.query.userId
  if (userId === undefined) {
    res.status(400).send('User id should be given')
  } else if (isNaN(userId)) {
    res.status(400).send('User id should be number')
  } else {
    const usersTasks = await getTasksForUser(userId, userTaskRepo, taskRepo)
    res.send(usersTasks)
  }
})

app.get('/getUsers', async (req, res) => {
  // const userId = req.query.userId
  const users = await userRepo.getAll()
  res.send(users)
})

app.post('/addTask', async (req, res) => {

  const { userId, name, description } = req.body
  if ((userId === undefined) || (name === undefined)) {
    res.status(400).send('Missing userId or task name.')
    return
  } 
  const ret_val1 = await taskRepo.create(name, description)
  const taskId = ret_val1.id

  console.log("userId:" + userId + " name:" + name + " desc:" + description )

  // Create userTask relation with the given data
  await userTaskRepo.create(userId, taskId)

  res.status(204).send('Task created.')
})

app.post('/deleteTask', async (req, res) => {
  const { userId, taskId} = req.body;
  if ((userId === undefined) || (taskId === undefined)) {
    res.status(400).send('Missing userId or taskId.');
    return;
  } 
  await userTaskRepo.delete(userId, taskId);
  await taskRepo.delete(taskId);
  console.log("userId:" + userId + " taskId:", taskId," + DELETED" );
  res.status(204).send('Task deleted.');  
})

app.post('/updateTime', async (req, res) => {
  const { userId, taskId, timeToAdd } = req.body
  console.log("Adding timer value:" + timeToAdd)
  await userTaskRepo.increaseTimer(userId, taskId, timeToAdd)
  res.status(204).send('Time added to the specified task.')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

app.post('/completeTask', async (req, res) => {
  const userid = req.body.userId
  const taskid = req.body.taskId
  const complete = req.body.completed
  await userTaskRepo.changeComplete(userid, taskid, complete)
  res.status(204).send('Task completed')
})
