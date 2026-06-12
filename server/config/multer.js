const multer = require('multer');
const path = require('path'); // Import the path module

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //   store data to my pc
        cb(null, 'uploads/profiles');
    },
    filename: function (req, file, cb) {

        const fileExtension = path.extname(file.originalname);
        // Get the original filename without the extension
        const originalBaseName = path.basename(file.originalname, fileExtension);

        const sanitizedBaseName = originalBaseName.replace(/[^a-zA-Z0-9-_]/g, '_');

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(null, `${sanitizedBaseName}-${uniqueSuffix}${fileExtension}`);
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };