'use strict';

var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var _s = require('lodash/string');
var _merge = require('lodash/object/merge');

module.exports = generators.NamedBase.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the install message',
      type: Boolean
    });
  },
  initializing: function () {
    this.pkg = require('../package.json');
  },
  prompting: function () {
    var done = this.async();

    if (!this.options['skip-welcome-message']) {
      this.log(yosay('O! I hear you would like a minimalistic scaffold with a React front-end, a Flask back-end, a gulpfile, Webpack config, Less, and Mocha tests'));
    }

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'What is the name of your project?',
      default: this.appname,
      store: true
    }, {
      type: 'input',
      name: 'userName',
      message: 'What is your name? (Used for the package.json.)',
      store: true
    }, {
      type: 'input',
      name: 'email',
      message: 'What is your email address? (Used for the package.json.)',
      store: true
    }, {
      type: 'input',
      name: 'github',
      message: 'What is your GitHub user name? (Used for the package.json.)',
      store: true
    }];

    this.prompt(prompts, function (answers) {
      this.kebabName = _s.kebabCase(answers.appName);
      this.snakeName = _s.snakeCase(answers.appName);
      this.pascalName = _s.capitalize(_s.camelCase(answers.appName));
      this.user = {
        name: answers.userName,
        email: answers.email,
        github: answers.github
      };

      done();
    }.bind(this));
  },
  writing: {
    gulpfile: function () {
      this.fs.copyTpl(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        {
          date: (new Date()).toISOString().split('T')[0],
          name: this.pkg.name,
          version: this.pkg.version
        }
      );
    },
    packageJSON: function () {
      var packageJSON = _merge({
        name: this.kebabName,
        version: '1.0.0',
        description: 'Front-end for ' + this.kebabName,
        main: 'src/js/main.js',
        scripts: {
          app: 'npm run prod && python ' + this.snakeName + '.py',
          compile: 'gulp compile',
          lint: 'eslint src/js',
          prod: 'gulp prod',
          test: 'mocha --compilers js:babel/register --recursive spec/*',
          watch: 'gulp watch'
        },
        author: this.user.name + ' <' + this.user.email + '>',
        repository: {
          type: 'git',
          url: 'https://www.github.com/' + this.user.github + '/' + this.kebabName + '.git'
        },
        devDependencies: {
          babel: '^5.8.23',
          'babel-core': '^5.8.25',
          'babel-loader': '^5.3.2',
          chai: '^3.3.0',
          eslint: '^1.6.0',
          gulp: '^3.9.0',
          'gulp-less': '^3.0.3',
          'gulp-minify-css': '^1.2.1',
          'gulp-watch': '^4.3.5',
          'less-plugin-autoprefix': '^1.5.1',
          mocha: '^2.3.3',
          'react-addons-test-utils': '^0.14.0',
          sinon: '^1.17.1',
          webpack: '^1.12.2'
        },
        dependencies: {
          'normalize.less': '^1.0.0',
          q: '^1.4.1',
          react: '^0.14.0',
          'react-dom': '^0.14.0'
        }
      }, this.pkg);

      this.fs.writeJSON('package.json', packageJSON);
    },
    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },
    readme: function () {
      this.fs.copyTpl(
        this.templatePath('README'),
        this.destinationPath('README.md'),
        {
          appName: this.kebabName
        }
      );
    },
    eslintrc: function () {
      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc')
      );
    },
    styles: function () {
      this.fs.copy(
        this.templatePath('main.less'),
        this.destinationPath('src/less/main.less')
      );
    },
    js: function () {
      this.fs.copy(
        this.templatePath('webpack.config.js'),
        this.destinationPath('webpack.config.js')
      );

      this.fs.copyTpl(
        this.templatePath('main.js'),
        this.destinationPath('src/js/main.js'),
        {
          componentName: this.pascalName
        }
      );

      this.fs.copy(
        this.templatePath('component.jsx'),
        this.destinationPath('src/js/components/' + this.kebabName + '.jsx')
      );

      this.fs.copyTpl(
        this.templatePath('component-spec.jsx'),
        this.destinationPath('spec/components/' + this.kebabName + '-spec.jsx'),
        {
          componentName: this.pascalName,
          kebabName: this.kebabName
        }
      );
    },
    flask: function () {
      this.fs.copy(
        this.templatePath('api.py'),
        this.destinationPath(this.snakeName + '.py')
      );

      this.fs.copyTpl(
        this.templatePath('api_tests.py'),
        this.destinationPath(this.snakeName + '_tests.py'),
        {
          appName: this.pascalName
        }
      );

      this.fs.copy(
        this.templatePath('index.html'),
        this.destinationPath('templates/index.html')
      );

      this.fs.copy(
        this.templatePath('requirements.txt'),
        this.destinationPath('requirements.txt')
      );
    }
  },
  install: function () {
    this.installDependencies({
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });
  },
  end: function () {
    if (this.options['skip-install']) {
      this.log(
        '\nRun ' +
        chalk.yellow.bold('npm install') +
        ' to install Node dependencies.'
      );
    }

    this.log(
      '\nThe following will set up your Python virtual environment ' +
      'and install dependencies:\n' +
      '\n* ' + chalk.yellow.bold('pyvenv env') +
      '\n* ' + chalk.yellow.bold('source env/bin/activate') +
      '\n* ' + chalk.yellow.bold('pip install -r requirements.txt')
    );
  }
});
