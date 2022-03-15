const AWS = require('aws-sdk');
const webpackConfig = require('./webpack.prod.config');
const { getVersion, buildProjectAsync, generateHtmlChangelog, uploadLocalFileAsync, fileExistsAsync } = require('./functions');
const S3DIR = 'sdk-js';

(async function () {
  try {
    console.log(`Environment: ${process.argv[2]}`);
    if (!process.argv[2])
      throw new Error('Missing environment');
    const bucketName = ''; //TODO: retrieve bucket name
    const version = getVersion(process.argv[3]);
    const changelogName = `changelog_${version.major}.${version.minor}`;
    console.log('Building project')
    const stats = await buildProjectAsync(webpackConfig);
    console.log('Build complete\n', stats);
    console.log('Generating change log');
    generateHtmlChangelog(changelogName + '.md', changelogName + '.html');
    console.log('Change log generated');

    const filesToUpload = [
      { localPath: './dist/cardknox-sdk.min.js', key: `${version.getFullVersion()}/cardknox-sdk.min.js` },
      { localPath: './public/sample.html', key: `${version.getFullVersion()}/sample.html` },
      { localPath: './versions.html', key: `versions.html` },
      { localPath: `./${changelogName}.html`, key: `${changelogName}.html` }
    ];

    //TODO: retrieve AWS credentials
    const S3 = new AWS.S3({ apiVersion: '2006-03-01' });
    console.log('Uploading to CDN');
    await Promise.all(filesToUpload.map(async item => {
      if (!(await fileExistsAsync(item.localPath)))
        throw new Error(`Missing file: ${item.localPath}`);
    }));
    await Promise.all(filesToUpload.map(async item => {
      await uploadLocalFileAsync(S3, {
        localPath: item.localPath,
        key: `${S3DIR}/${item.key}`,
        bucketName: bucketName
      });
      console.log(`${item.key}: uploaded`);
    }));
    console.log('Upload complete');
  } catch (error) {
    console.error(error);
  }
})();
