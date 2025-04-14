const url = require('url');
const TaskController = require('./controller');
const utils = require('./utils');

class Router {
    async handleRequest(req, res) {
        res.setHeader('Content-Type', 'application/json');

        try {
            // GET all tasks
            if (req.url === '/api/tasks' && req.method === 'GET') {
                const tasks = await TaskController.getAllTasks();
                res.statusCode = 200;
                res.end(JSON.stringify(tasks));
            }
            // GET task by id
            else if (req.url.match(/\/api\/tasks\/([0-9]+)/) && req.method === 'GET') {
                const id = req.url.split('/')[3];
                const task = await TaskController.getTaskById(id);
                if (task) {
                    res.statusCode = 200;
                    res.end(JSON.stringify(task));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ status: 404, message: `Task with id ${id} not found` }));
                }
            }
            // POST new task
            else if (req.url === '/api/tasks' && req.method === 'POST') {
                const data = await utils.getPostData(req);
                const task = await TaskController.createTask(JSON.parse(data));
                res.statusCode = 201;
                res.end(JSON.stringify({ status: 201, task }));
            }
            // PATCH update task
            else if (req.url === '/api/tasks' && req.method === 'PATCH') {
                const data = await utils.getPostData(req);
                const task = await TaskController.updateTask(JSON.parse(data));
                if (task) {
                    res.statusCode = 200;
                    res.end(JSON.stringify({ status: 200, task }));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ status: 404, message: `No task with id ${JSON.parse(data).id} found` }));
                }
            }
            // DELETE task
            else if (req.url.match(/\/api\/tasks\/([0-9]+)/) && req.method === 'DELETE') {
                const id = req.url.split('/')[3];
                const result = await TaskController.deleteTask(id);
                if (result) {
                    res.statusCode = 202;
                    res.end(JSON.stringify({ status: 202, message: `Task with id ${id} deleted successfully` }));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ status: 404, message: `Task with id ${id} not found` }));
                }
            }
            // Not found
            else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'Route not found' }));
            }
        } catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    }
}

module.exports = new Router();