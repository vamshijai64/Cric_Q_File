// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const uploadDirectory = 'uploads/';
// if (!fs.existsSync(uploadDirectory)) {
//     fs.mkdirSync(uploadDirectory,{ recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/') // Save files in 'uploads/' directory
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })

// // const upload = multer({ storage: storage });

// // const upload = multer({
// //     storage: storage,
// //     fileFilter: (req, file, cb) => {
// //         const fileTypes = /jpeg|jpg|png/;
// //         const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
// //         const mimetype = fileTypes.test(file.mimetype);

// //         if (extname && mimetype) {
// //             return cb(null, true);
// //         } else {
// //             cb(new Error('Only images (jpeg, jpg, png), files are allowed'));
// //         }
// //     }
// // })

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only JPEG, JPG, and PNG files are allowed'), false);
//     }
// };

// // Multer upload settings
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
//     fileFilter: fileFilter
// });

// module.exports = upload;

// // Backend - Node.js (example)
// const AWS = require('aws-sdk');
// const express = require('express');
// const app = express();
// require("dotenv").config();
// const fs = require('fs');

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: 'ap-south-1', // Set to your AWS region (Mumbai region in this case)
//   });
  
//   // Endpoint to get the presigned URL for file upload
//   app.post('/get-presigned-url', async (req, res) => {
//     const { fileName, fileType } = req.body;
  
//     // Prefix the file name with 'uploads/' to create the directory structure in S3
//     const filePath = `uploads/${Date.now()}-${fileName}`;
  
//     // Generate the presigned URL from S3
//     const s3Params = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: filePath, // Ensure the file is uploaded under the 'uploads/' directory
//       Expires: 60, // Expiration time for the URL in seconds
//       ContentType: fileType, // Set the content type for the file
//       ACL: 'public-read', // Allow public read access to the uploaded file
//     };
  
//     try {
//       // Get the presigned URL from S3
//       const signedUrl = await s3.getSignedUrlPromise('putObject', s3Params);
//       res.json({ url: signedUrl, key: filePath });
//     } catch (error) {
//       console.error('Error generating presigned URL:', error);
//       res.status(500).send('Error generating URL');
//     }
//   });



// const { S3Client } = require("@aws-sdk/client-s3");
// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const path = require("path");
// require("dotenv").config();

// //  AWS S3 Configuration
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// //  Configure Multer for AWS S3 (WITHOUT ACL)
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET_NAME,
//     contentType: multerS3.AUTO_CONTENT_TYPE, // Auto detect file type
//     key: function (req, file, cb) {
//       const filename = `uploads${Date.now()}-${file.originalname}`;
//       cb(null, filename);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images (jpeg, jpg, png) are allowed"));
//     }
//   },
// });

// module.exports = upload;


// // middleware/upload.js
// const AWS = require("aws-sdk");

// const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
// const REGION = process.env.AWS_REGION;

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: REGION,
// });

// const s3 = new AWS.S3();

// const generateUploadURL = async (fileName, fileType) => {
//   const key = `uploads/${Date.now()}_${fileName}`;

//   const params = {
//     Bucket: S3_BUCKET,
//     Key: key,
//     Expires: 60, // 1 min
//     ContentType: fileType,
//     ACL: "public-read",
//   };

//   const signedUrl = await s3.getSignedUrlPromise("putObject", params);
//   const publicUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

//   return { signedUrl, publicUrl };
// };

// module.exports = { generateUploadURL };

// backend/routes/s3Routes.js


const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

// Configure S3 instance
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

// S3 signed URL generation route
router.post("/s3/generate-upload-url", async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    const key = `uploads/${Date.now()}_${fileName}`;

    const params = {
      Bucket: "cinemaquiz",
      Key: key,
      Expires: 60, 
      ContentType: fileType,
      ACL: "public-read",
    };

    const signedUrl = await s3.getSignedUrlPromise("putObject", params);
    const finalUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({ signedUrl, finalUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Error generating signed URL" });
  }
});

module.exports = router;
