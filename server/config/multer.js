const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Always save uploads inside the server folder.
// This prevents ENOENT errors when the app is started from a different directory.
const uploadDir = path.join(__dirname, '..', 'uploads', 'profiles');

// Create uploads/profiles automatically if it does not exist.
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const originalBaseName = path.basename(file.originalname, fileExtension);
        const sanitizedBaseName = originalBaseName.replace(/[^a-zA-Z0-9-_]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(null, `${sanitizedBaseName}-${uniqueSuffix}${fileExtension}`);
    }
});

const fileFilter = function (req, file, cb) {
    const allowedExtensions = /jpeg|jpg|png|webp/;
    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = file.mimetype && file.mimetype.startsWith('image/');

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

module.exports = { upload };
