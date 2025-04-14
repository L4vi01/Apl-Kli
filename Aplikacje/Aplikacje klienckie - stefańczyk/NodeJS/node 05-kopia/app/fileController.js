const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

class FileController {
    constructor() {
        this.uploadsDir = path.join(__dirname, '..', 'uploads');
        this.ensureUploadsDir();
    }

    ensureUploadsDir() {
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir);
        }
    }

    ensureAlbumDir(albumName) {
        const albumPath = path.join(this.uploadsDir, albumName);
        if (!fs.existsSync(albumPath)) {
            fs.mkdirSync(albumPath);
        }
        return albumPath;
    }

    async handleFileUpload(req) {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }

                const file = files.file;
                const album = fields.album || 'default';
                const albumPath = this.ensureAlbumDir(album);
                const fileExt = path.extname(file.name);
                const newFileName = `upload_${Math.random().toString(36).substr(2, 32)}${fileExt}`;
                const newPath = path.join(albumPath, newFileName);

                fs.copyFile(file.path, newPath, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    fs.unlink(file.path, () => { });
                    resolve({
                        originalName: file.name,
                        album: album,
                        url: path.join('uploads', album, newFileName)
                    });
                });
            });
        });
    }

    deleteFile(filePath) {
        return new Promise((resolve, reject) => {
            const fullPath = path.join(__dirname, '..', filePath);
            fs.unlink(fullPath, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}

module.exports = new FileController();