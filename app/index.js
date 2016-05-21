const generators = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');
const camelCase = require('lodash.camelcase');
const capitalize = require('lodash.capitalize');
const kebabCase = require('lodash.kebabcase');
const snakeCase = require('lodash.snakecase');

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
      this.kebabName = kebabCase(answers.appName);
      this.snakeName = snakeCase(answers.appName);
      this.pascalName = capitalize(camelCase(answers.appName));
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
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          kebabName: this.kebabName,
          snakeName: this.snakeName,
          user: {
            name: this.user.name,
            email: this.user.email,
            github: this.user.github
          }
        }
      );
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
    editorconfig: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },
    babelrc: function () {
      this.fs.copy(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc')
      );
    },
    eslintrc: function () {
      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc.json')
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
        this.templatePath('component-test.jsx'),
        this.destinationPath('test/components/' + this.kebabName + '-test.jsx'),
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
