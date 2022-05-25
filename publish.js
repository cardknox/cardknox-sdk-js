const AWS = require('aws-sdk');
const webpackConfig = require('./webpack.prod.config');
const { buildProjectAsync, generateHtmlChangelogAsync, uploadLocalFileAsync, fileExistsAsync, versionExistsAsync, changelogHasVersionAsync } = require('./functions');
const S3DIR = 'sdk-js';

(async function () {
  try {
    console.log(`Environment: ${process.argv[2]}`);
    if (!process.argv[2])
      throw new Error('Missing environment');
    const bucketName = process.argv[2] + process.env.BUCKET_NAME;

    let { version, releaseChannel } = require('./package.json');
    if (releaseChannel)
      version += '-' + releaseChannel;
    console.log('Version: ' + version)

    console.log('Checking if version exists')
    const S3 = new AWS.S3({ apiVersion: '2006-03-01' });
    if (await versionExistsAsync(S3, version, bucketName, S3DIR)) {
      console.log(`Version ${version} found, exiting`);
      return;
    }
    console.log('Version not found, continuing with publish')

    console.log('Building project');
    const stats = await buildProjectAsync(webpackConfig);
    console.log('Build complete\n', stats);

    console.log('Generating change log');
    const [major, minor] = version.split('.');
    const changelogName = `changelog_${major}.${minor}`;
    const changelogRequired = releaseChannel !== 'alpha' && !(await changelogHasVersionAsync(changelogName + '.md', version));
    if (changelogRequired)
      throw new Error('Missing changelog');
    await generateHtmlChangelogAsync(changelogName + '.md', changelogName + '.html');
    console.log('Change log generated');

    const filesToUpload = [
      { localPath: './dist/cardknox-sdk.min.js', key: `${version}/cardknox-sdk.min.js` },
      { localPath: './public/sample.html', key: `${version}/sample.html` },
      { localPath: './versions.html', key: `versions.html` },
      { localPath: `./${changelogName}.html`, key: `${changelogName}.html` }
    ];
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
    throw error;
  }
})();
