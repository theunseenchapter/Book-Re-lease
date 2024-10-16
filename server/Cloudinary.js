const express = require('express');
const { v2: cloudinary } = require('cloudinary');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();

// Middleware for file upload handling
app.use(fileUpload({ useTempFiles: true }));

// Cloudinary Configuration (use environment variables)
cloudinary.config({
  cloud_name: 'dqgrd9a68',
  api_key: '389627174249194',
  api_secret:'D69bUIBYjxbP1AJUxntSPiH51-8'
});

// API route to handle image uploads
app.post('/api/books/createBook', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded.' });
        }

        // Get the image from the request
        const imageFile = req.files.photo; // 'photo' is the name attribute of the input field

        // Upload the image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
            public_id: 'uploaded_image_' + Date.now(), // Optional: generate a unique public ID
            folder: 'uploads', // Optional: save in specific folder on Cloudinary
        });

        // Return the uploaded image URL
        return res.json({
            message: 'Image uploaded successfully!',
            url: uploadResult.secure_url // Cloudinary image URL
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload image', error });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
