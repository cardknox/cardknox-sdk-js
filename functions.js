
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { Transform } = require('stream');

/**
 * 
 * Uses webpack to build the project
 * Will reject on errors or warnings; error result will contain the errors or warnings
 * @param webpackConfig
 * @returns {Promise<Object>} Promise representing the result of the build
 */
function buildProjectAsync(webpackConfig) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err)
        reject(err);
      const info = stats.toString('summary');
      if (stats.hasErrors() || stats.hasWarnings())
        reject(info);
      resolve(info);
    });
  });
}

/**
 * 
 * @param {string} changelogPath 
 * @param {string} version 
 * @returns {Promise<boolean>}
 */
function changelogHasVersion(changelogPath, version) {
  return new Promise((resolve, reject) => {
    fs.readFile(changelogPath, (err, data) => {
      if (err)
        reject(err);
      else
        resolve(data.toString().includes(version))
    });
  });
}

/**
 * Transforms a Markdown changelog to html using the 'showdown' module
 * @param {string} source - File path of source
 * @param {string} destination - File path of destination
 */
function generateHtmlChangelog(source, destination) {
  const showdown = new (require('showdown').Converter)({ completeHTMLDocument: true, noHeaderId: true });
  showdown.setFlavor('github');
  fs.createReadStream(source)
    .pipe(new Transform({
      transform: (chunk, encoding, done) => {
        const result = showdown.makeHtml(chunk.toString());
        done(null, result);
      }
    }))
    .pipe(fs.createWriteStream(destination));
}

/**
 * 
 * @typedef {import('aws-sdk').S3.PutObjectOutput} PutObjectOutput
 */

/**
 * 
 * @typedef {import('aws-sdk').S3} S3
 */

/**
 * 
 * @param {S3} s3 
 * @param {string} version 
 * @param {string} bucketName 
 * @param {string} s3Dir 
 * @returns {Promise<boolean>}
 * @returns 
 */
async function versionExistsAsync(s3, version, bucketName, s3Dir) {
  const response = await s3.listObjectsV2({
    Bucket: bucketName,
    Prefix: `${s3Dir}/${version}`
  }).promise();
  return !!response.Contents.length;
}

/**
 * 
 * @typedef UploadOptions
 * @property {string} localPath
 * @property {string} key
 * @property {string} bucketName
 */

/**
 * 
 * @param {S3} s3
 * @param {UploadOptions} options
 * @returns {Promise<PutObjectOutput>} Promise resulting with the response
 * @throws AWS.AWSError
 */
async function uploadLocalFileAsync(s3, options) {
  try {
    const contents = await readFileAsync(options.localPath);
    return await s3.putObject({
      Bucket: options.bucketName,
      Key: options.key,
      Body: contents,
      ServerSideEncryption: 'AES256',
      ContentType: getContentType(options.localPath)
    }).promise();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 
 * @param {string} filePath 
 * @returns {Promise<boolean>} Promise resulting with the file-exist check
 */
function fileExistsAsync(filePath) {
  return new Promise((resolve) => {
    fs.stat(filePath, err => {
      if (err)
        resolve(false);
      resolve(true);
    });
  })
}

/**
 * 
 * Using 'UTF-8' encoding
 * @param {string} filePath 
 * @returns {Promise<string>} Promise resulting with the contents of the file
 */
function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });
}

/**
 * 
 * Returns MIME type for js and html files
 * @param {string} fileName 
 * @returns {string} MIME type
 */
function getContentType(fileName) {
  switch (path.extname(fileName)) {
    case '.html':
      return 'text/html';
    case '.js':
      return 'text/javascript'
    default:
      return 'text/plain';
  }
}

module.exports = {
  buildProjectAsync,
  generateHtmlChangelog,
  changelogHasVersion,
  uploadLocalFileAsync,
  fileExistsAsync,
  versionExistsAsync
}
