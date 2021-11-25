export async function getTasksForUser (userId, userTaskRepo, taskRepo) {
  const userTasks = await userTaskRepo.getAllTasksByUserId(userId)
  const tasksWithTimerAndCompleted = await Promise.all(userTasks.map(async userTask => {
    const task = await taskRepo.getById(userTask.taskId)
    return {
      name: task.name,
      description: task.description,
      ...userTask
    }
  }))
  return tasksWithTimerAndCompleted
}