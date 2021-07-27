const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.KEY,
    api_secret: process.env.SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'NOMADS',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}