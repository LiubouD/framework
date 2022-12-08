const path = require("path");
const AWS = require("aws-sdk");
const fs = require("fs-extra");
const readdir = require("recursive-readdir");
const async = require("async");

/**
 * function to upload the test report run folder to an s3 - AWS
 */
module.exports = {
  s3Upload() {
    const browserName = global.settings.remoteConfig || global.BROWSER_NAME;
    const folderName = `/${date}/${dataconfig.s3FolderName}/reports`;
    // const BUCKET = s3Data.S3_BUCKET + folderName;
    const BUCKET = `test-app-automated-reports${folderName}`;
    const KEY = process.env.S3_KEY;
    const SECRET = process.env.S3_SECRET;

    // let rootFolder;
    // let uploadFolder;
    // let uploadFile;

    const rootFolder = path.resolve("./reports");
    const uploadFolder = `./${browserName}`;
    // if (projectName === 'OEUK ORB') {
    //   rootFolder = path.resolve('./reports');
    //   uploadFolder = `./${browserName}`;
    //   uploadFile = './';
    // }

    // let data1;

    const s3 = new AWS.S3({
      signatureVersion: "v4",
      accessKeyId: KEY,
      secretAccessKey: SECRET,
    });

    function getFiles(dirPath) {
      return fs.existsSync(dirPath) ? readdir(dirPath) : [];
    }

    async function deploy(upload) {
      const filesToUpload = await getFiles(path.resolve(rootFolder, upload));
      return new Promise((resolve, reject) => {
        async.eachOfLimit(
          filesToUpload,
          30,
          async.asyncify(async (file) => {
            const Key = file.replace(`${rootFolder}/`, "");
            console.log(`uploading: [${Key}]`);
            return new Promise((res, rej) => {
              s3.upload(
                {
                  Key,
                  Bucket: BUCKET,
                  Body: fs.readFileSync(file),
                  ContentType: "text/html",
                },
                // eslint-disable-next-line consistent-return
                async (err, data) => {
                  if (err) {
                    return rej(new Error(err));
                  }
                  res({ result: true });
                  if (data) {
                    const data1 = await data;
                  }
                }
              );
            });
          }),
          // eslint-disable-next-line consistent-return
          (err) => {
            if (err) {
              return reject(new Error(err));
            }
            resolve({ result: true });
          }
        );
      });
    }

    // if (projectName === 'OEUK ORB') {
    //   deploy(uploadFile)
    //     .then(() => {
    //       console.log('File uploaded successfully, report folder pushed to s3');
    //     })
    //     .catch((err) => {
    //       console.error(err.message);
    //       process.exit(0);
    //     });
    // } else
    // {
    deploy(uploadFolder)
      .then(() => {
        console.log("Files uploaded successfully, report folder pushed to s3");
      })
      .catch((err) => {
        console.error(err.message);
        process.exit(0);
      });
    // }
  },
};
