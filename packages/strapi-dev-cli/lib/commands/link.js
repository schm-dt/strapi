'use strict';

const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');

module.exports = (project, monorepo, cmd) => {
  const projectDir = path.resolve(project);
  const packagesDir = path.resolve(monorepo, 'packages');
  const runOnce = cmd.runOnce === true ? true : false;
  const quiet = cmd.quiet === true ? true : false;

  console.log({
    projectDir,
    packagesDir,
    runOnce,
    quiet,
  });

  const ignored = [
    /node_modules/,
    /\.git/,
    /\.DS_Store/,
    /__tests__/,
    /\.test\.js/,
  ];

  chokidar
    .watch(packagesDir, {
      ignored: [
        filePath => ignored.filter(reg => reg.test(filePath)).length > 0,
      ],
    })
    .on('all', (event, filePath) => {
      if (['change', 'add'].includes(event)) {
        const newPath = path.join(
          projectDir,
          'node_modules',
          path.relative(packagesDir, filePath)
        );
        fs.copy(filePath, newPath);

        if (!quiet) {
          console.log(
            `Copied ${filePath} to ${path.join(
              'node_modules',
              path.relative(packagesDir, filePath)
            )}`
          );
        }
      }
    })
    .on('ready', () => {
      if (runOnce) {
        process.exit(0);
      }
    });
};
