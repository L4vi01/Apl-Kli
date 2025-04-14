const url = require('url');
const FileController = require('./fileController');
const JsonController = require('./jsonController');
const utils = require('./utils');

class Router {
    async handleRequest(req, res) {
        res.setHeader('Content-Type', 'application/json');

        try {
            // POST new photo
            if (req.url === '/api/photos' && req.method === 'POST') {
                const uploadResult = await FileController.handleFileUpload(req);
                const photo = await JsonController.addPhoto(uploadResult);
                res.statusCode = 201;
                res.end(JSON.stringify(photo));
            }
            // GET all photos
            else if (req.url === '/api/photos' && req.method === 'GET') {
                const photos = await JsonController.getAllPhotos();
                res.statusCode = 200;
                res.end(JSON.stringify(photos));
            }
            // GET photo by id
            else if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method === 'GET') {
                const id = req.url.split('/')[3];
                const photo = await JsonController.getPhotoById(id);
                if (photo) {
                    res.statusCode = 200;
                    res.end(JSON.stringify(photo));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ message: `photo with id ${id} not found` }));
                }
            }
            // PATCH update photo history
            else if (req.url === '/api/photos' && req.method === 'PATCH') {
                const data = await utils.getPostData(req);
                const { id, status } = JSON.parse(data);
                const photo = await JsonController.updatePhotoHistory(id, status);
                if (photo) {
                    res.statusCode = 200;
                    res.end(JSON.stringify(photo));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ message: `photo with id ${id} not found` }));
                }
            }
            // DELETE photo
            else if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method === 'DELETE') {
                const id = req.url.split('/')[3];
                const result = await JsonController.deletePhoto(id);
                if (result) {
                    res.statusCode = 200;
                    res.end(JSON.stringify({ message: `photo with id ${id} deleted` }));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ message: `photo with id ${id} not found` }));
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