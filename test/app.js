/* eslint max-nested-callbacks:0 */

const path = require('path');
const expect = require('chai').expect;
const helpers = require('yeoman-test');
const yassert = require('yeoman-assert');

describe('react-flask', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '..', 'app'))
      .withOptions({
        'skip-welcome-message': true,
        'skip-install-message': true
      })
      .withPrompts({
        appName: 'fun',
        userName: 'Yo',
        email: 'yo@example.com',
        github: 'yofun'
      })
      .toPromise();
  });

  it('generates a README', function () {
    yassert.file('README.md');
  });

  describe('generates config for', function () {
    it('Babel', function () {
      yassert.file('.babelrc');
    });

    it('EditorConfig', function () {
      yassert.file('.editorconfig');
    });

    it('ESLint', function () {
      yassert.file('.eslintrc.json');
    });

    it('gitignore', function () {
      yassert.file('.gitignore');
      yassert.fileContent('.gitignore', /env/);
      yassert.fileContent('.gitignore', /node_modules/);
      yassert.fileContent('.gitignore', /npm-debug/);
      yassert.fileContent('.gitignore', /static/);
    });

    it('gulp', function () {
      yassert.file('gulpfile.js');
    });

    it('npm', function () {
      yassert.file('package.json');
      yassert.fileContent('package.json', /"author": "Yo <yo@example.com>"/);
      yassert.fileContent('package.json', /"name": "fun"/);
    });

    it('PIP', function () {
      yassert.file('requirements.txt');
    });

    it('Webpack', function () {
      yassert.file('webpack.config.js');
    });
  });

  describe('generates Python files for', function () {
    it('a Flask app', function () {
      yassert.file('fun.py');
    });

    it('unit tests', function () {
      yassert.file('fun_tests.py');
    });

    it('templates', function () {
      yassert.file('templates/index.html');
    });
  });

  describe('generates client-side files for', function () {
    it('a React app', function () {
      yassert.file([
        'src/js/main.js',
        'src/js/components/fun.jsx'
      ]);
    });

    it('Less CSS', function () {
      yassert.file('src/less/main.less');
    });

    it('unit tests', function () {
      yassert.file('test/components/fun-test.jsx');
    });
  });
});
