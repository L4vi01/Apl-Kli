const TaskModel = require('./taskmodel');

class TaskController {
    async getAllTasks() {
        return TaskModel.getAllTasks();
    }

    async getTaskById(id) {
        return TaskModel.getTaskById(id);
    }

    async createTask(taskData) {
        return TaskModel.createTask(taskData);
    }

    async updateTask(taskData) {
        return TaskModel.updateTask(taskData);
    }

    async deleteTask(id) {
        return TaskModel.deleteTask(id);
    }
}

module.exports = new TaskController();