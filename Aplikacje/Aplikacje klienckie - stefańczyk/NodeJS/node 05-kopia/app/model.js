const fs = require('fs');
const path = require('path');

class ImageModel {
    constructor() {
        this.dbPath = path.join(__dirname, '..', 'db.json');
        this.ensureDb();
    }

    ensureDb() {
        if (!fs.existsSync(this.dbPath)) {
            fs.writeFileSync(this.dbPath, JSON.stringify([]));
        }
    }

    async readDb() {
        const data = await fs.promises.readFile(this.dbPath, 'utf8');
        return JSON.parse(data);
    }

    async writeDb(data) {
        await fs.promises.writeFile(this.dbPath, JSON.stringify(data, null, 2));
    }

    async getAllPhotos() {
        return await this.readDb();
    }

    async getPhotoById(id) {
        const photos = await this.readDb();
        return photos.find(photo => photo.id === parseInt(id));
    }

    async addPhoto(photoData) {
        const photos = await this.readDb();
        const newPhoto = {
            id: Date.now(),
            album: photoData.album,
            originalName: photoData.originalName,
            url: photoData.url,
            lastChange: 'original',
            history: [
                {
                    status: 'original',
                    timestamp: Date.now()
                }
            ]
        };
        photos.push(newPhoto);
        await this.writeDb(photos);
        return newPhoto;
    }

    async updatePhotoHistory(id, newStatus) {
        const photos = await this.readDb();
        const photoIndex = photos.findIndex(photo => photo.id === parseInt(id));

        if (photoIndex === -1) return null;

        const photo = photos[photoIndex];
        photo.lastChange = newStatus;
        photo.history.push({
            status: newStatus,
            timestamp: Date.now()
        });

        await this.writeDb(photos);
        return photo;
    }

    async deletePhoto(id) {
        const photos = await this.readDb();
        const photoIndex = photos.findIndex(photo => photo.id === parseInt(id));

        if (photoIndex === -1) return null;

        const photo = photos[photoIndex];
        photos.splice(photoIndex, 1);
        await this.writeDb(photos);
        return photo;
    }
}

module.exports = new ImageModel();