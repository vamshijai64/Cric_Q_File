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
      Expires: 60, // URL expires in 60 seconds
      ContentType: fileType,
    //  ACL: "public-read", // So the file is accessible publicly
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
