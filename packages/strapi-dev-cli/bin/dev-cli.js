#!/usr/bin/env node
'use strict';

const commander = require('commander');

const link = require('../lib/commands/link');
const pkgJSON = require('../package.json');

const program = new commander.Command();

program.version(pkgJSON.version);

program
  .command('link <project> <monorepo>')
  .option('--run-once', 'Run command only once')
  .option('-q, --quiet', 'Run command quietly')
  .action(link);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
