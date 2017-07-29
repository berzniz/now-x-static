#! /usr/bin/env node
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const del = require('del')
const yargonaut = require('yargonaut')
  .style('grey')
const chalk = yargonaut.chalk()
const argv = require('yargs')
  .usage(chalk.bold('\nnow-x-static') + ' [options] <path>')
  .help('h')
  .alias('h', 'help')
  .option('a', {
    alias: 'api',
    describe: 'Proxy /api to chosen endpoint [example: https://api.company.com]',
    type: 'string'
  })
  .option('e', {
    alias: 'eject',
    describe: 'Eject configuration for customization (with no deployment)',
    type: 'boolean'
  })
  .example('now-x-static', 'Deploy current folder')
  .example('now-x-static build_folder', 'Deploy build_folder')
  .example('now-x-static -a api.test.com', 'Deploy and proxy /api to https://api.test.com')
  .argv

const folder = argv._[0] || '.'

const run = (cmd, args) => {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' })
    child.on('error', (code) => {
      reject(code)
    })
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(code)
      }
    })
  })
}

const clean = () => {
  console.log('> Cleaning Dockerfile')
  del.sync(path.resolve(folder, 'Dockerfile'))
  del.sync(path.resolve(folder, 'default.conf'))
}

const addOptions = (config) => {
  if (argv.a) {
    const endpoint = argv.a.startsWith('https://') || argv.a.startsWith('http://') ? argv.a : 'https://' + argv.a
    console.log(`> Adding proxy from ${chalk.bold('/api')} to ${chalk.bold(endpoint)}`)
    config = config
      .replace('{api_endpoint}', endpoint)
      .replace(/#api\ /g, '')
  }
  return config
}

const generate = () => {
  if (argv.a) {

  }

  const dockerfile = fs.readFileSync(path.resolve(__dirname, 'nginx/Dockerfile')).toString()
  const defaultConf = addOptions(
    fs.readFileSync(path.resolve(__dirname, 'nginx/default.conf')).toString()
  )

  fs.writeFileSync(path.resolve(folder, 'Dockerfile'), dockerfile, { flag: 'w' })
  fs.writeFileSync(path.resolve(folder, 'default.conf'), defaultConf, { flag: 'w' })
}

if (!argv.e) {
  console.log('> Deploying folder: ' + chalk.bold(folder))
}

if (!fs.existsSync(folder)) {
  console.log(chalk.red(`Folder ${chalk.bold(folder)} could not be found`))
  process.exit(1)
}

console.log('> Generating Dockerfile')
generate()

if (argv.e) {
  console.log('')
  console.log('Ejecting configuration files:')
  console.log('  - Dockerfile')
  console.log('  - default.config')
  console.log('')
  console.log(`Customize the files and run "now --docker ${folder}" to deploy`)
  process.exit(0)
}

console.log('> Deploying using ' + chalk.bold('now'))

run('now', ['--docker', folder])
  .then(() => {
    clean()
    console.log('')
    console.log(chalk.green('> Successfully deployed static application'))
  })
  .catch((error) => {
    clean()
    console.log(chalk.red(`${chalk.bold('now-x-static')} failed running "now --docker ${folder}" (error: ${error}`))
    process.exit(1)
  })