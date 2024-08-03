const mongoose = require("mongoose");
const { exec } = require('child_process');
const path = require('path');
const cron = require('node-cron');

const DB_NAME = 'pigmiCollection';
const DB_NAME_2 = 'sample_airbnb';
const BACKUP_PATH = path.join(__dirname, 'backups');

const backupMongoDB = () => {

    // Ensure the backup directory exists

    const fs = require("fs")
    if (!fs.existsSync(path.join(__dirname, 'backups'))) {
        fs.mkdirSync(path.join(__dirname, 'backups'));
    }

    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    const backupFile = `${BACKUP_PATH}/${DB_NAME}_${date}.archive`;

    const command = `mongodump --db=${DB_NAME} --archive=${backupFile}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error during backup: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Backup stderr: ${stderr}`);
            return;
        }
        console.log(`Backup created successfully: ${backupFile}`);
    });

};


const dbPath = process.env.DB_PATH;

mongoose.connect(dbPath).then(() => {
    console.log("Connection Successfull")
}).catch((error) => {
    console.log("Connnection Error : " + error)
})


cron.schedule('* * * * Monday', () => {
    console.log('Running backup job...');
    backupMongoDB();
});