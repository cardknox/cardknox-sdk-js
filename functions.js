
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { Transform } = require('stream');

/**
 * 
 * @typedef Version
 * @property {string} major
 * @property {string} minor
 * @property {string} patch
 * @property {string} deployment - Is empty when deployment is 'stable'
 * @property {() => string} getFullVersion
 */

/**
 * 
 * Relies on 'package.json' for the version number (including the date and id portion)
 * @param {string} deployment
 * @returns {Version}
 */
function getVersion(deployment) {
  const versionNumber = require('./package.json').version;
  const parts = versionNumber.split('.');
  const patch = `${parts[2]}.${parts[3]}`;
  return {
    major: parts[0],
    minor: parts[1],
    patch,
    deployment,
    getFullVersion: () => `${parts[0]}.${parts[1]}.${patch}${deployment ? '-' + deployment : ''}`
  };
}

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
      const info = stats.toString();
      if (stats.hasErrors() || stats.hasWarnings())
        reject(info);
      resolve(info);
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
 * @typedef {import('aws-sdk').S3.PutObjectRequest} PutObjectRequest
 */

/**
 * 
 * @typedef {import('aws-sdk').S3} S3
 */

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
 * @returns {Promise<PutObjectRequest>} Promise resulting with the response
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
  getVersion,
  buildProjectAsync,
  generateHtmlChangelog,
  uploadLocalFileAsync,
  fileExistsAsync
}
