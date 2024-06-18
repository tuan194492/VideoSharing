const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const uploadVideo = async (file, folderPath = '') => {
    try {
        const fileContent = fs.readFileSync(file.path);
        const fileName = file.originalname;
        const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
        const contentType = file.mimetype;

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filePath,
            Body: fileContent,
            ContentType: contentType
        };

        const data = await s3.upload(params).promise();

        // Clean up the uploaded file
        fs.unlinkSync(file.path);

        return {
            success: true,
            message: 'File uploaded successfully',
            key: data.Key,
            location: data.Location
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            success: false,
            message: 'Failed to upload file'
        };
    }
};

const createFolder = async (folderPath) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: folderPath.endsWith('/') ? folderPath : folderPath + '/'
        };

        await s3.putObject(params).promise();

        return {
            success: true,
            message: 'Folder created successfully'
        };
    } catch (error) {
        console.error('Error creating folder:', error);
        return {
            success: false,
            message: 'Failed to create folder'
        };
    }
};

module.exports = {
    uploadVideo,
    createFolder
};
