const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3300;

// Middleware
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Keep original filename with timestamp
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${timestamp}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
  // Removed fileFilter to accept any file type
});

// Handle multipart form data with multiple file uploads
app.post('/upload', upload.any(), (req, res) => {
  try {
    console.log('Received form data:', req.body);
    console.log('Received files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Process all uploaded files
    const processedFiles = req.files.map(file => {
      const fileInfo = {
        fieldName: file.fieldname,
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path
      };

      // If it's a JSON file, try to parse its content
      if (file.mimetype === 'application/json' ||
          path.extname(file.originalname).toLowerCase() === '.json') {
        try {
          const fileContent = fs.readFileSync(file.path, 'utf8');
          fileInfo.content = JSON.parse(fileContent);
        } catch (parseError) {
          fileInfo.parseError = 'Failed to parse JSON: ' + parseError.message;
        }
      }

      return fileInfo;
    });

    res.json({
      success: true,
      message: `${req.files.length} file(s) received and processed successfully`,
      formData: req.body,
      files: processedFiles,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(400).json({
      success: false,
      message: 'Error processing files',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`FormData server is running on port ${PORT}`);
  console.log(`Endpoint: POST http://localhost:${PORT}/upload`);
  console.log(`Accepts multipart/form-data with multiple files of any type`);
  console.log(`Files can be uploaded using any field names`);
});
