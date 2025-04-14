const tasks = [
    {
        id: 1,
        title: "zadanie 1",
        description: "łatwe",
        completed: false,
    },
    {
        id: 2,
        title: "zadanie 2",
        description: "trudne",
        completed: false,
    },
    {
        id: 3,
        title: "zadanie 3",
        description: "średnie",
        completed: false,
    },
    {
        id: 2137,
        title: "zadanie 2137",
        description: "średnie",
        completed: false,
    },
];

class TaskModel {
    constructor() {
        this.tasks = tasks;
    }

    getAllTasks() {
        return this.tasks;
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === parseInt(id));
    }

    createTask(taskData) {
        const newId = Math.max(...this.tasks.map(task => task.id), 0) + 1;
        const newTask = {
            id: newId,
            title: taskData.title,
            description: taskData.description,
            completed: false
        };
        this.tasks.push(newTask);
        return newTask;
    }

    updateTask(taskData) {
        const taskIndex = this.tasks.findIndex(task => task.id === parseInt(taskData.id));
        if (taskIndex === -1) return null;

        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...taskData
        };
        return this.tasks[taskIndex];
    }

    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === parseInt(id));
        if (taskIndex === -1) return false;

        this.tasks.splice(taskIndex, 1);
        return true;
    }
}

module.exports = new TaskModel();