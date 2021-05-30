const reporter = require('cucumber-html-reporter');

const options = {
  theme: 'bootstrap',
  reportSuiteAsScenarios: true,
  launchReport: true,
  jsonFile: 'bdd/report/cucumber-report.json',
  output: 'bdd/report/cucumber-report.html'
};

reporter.generate(options);