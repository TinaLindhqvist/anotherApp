'use strict';
console.log('TESTING STARTED');

var webdriver = require('selenium-webdriver'),
	username = process.env.SAUCE_USERNAME,
	accessKey = process.env.SAUCE_ACCESS_KEY,
	SauceLabs = require("saucelabs"),
	saucelabs = new SauceLabs({
		username: username,
		password: accessKey
	});
var assert = require('assert');

var driver;

driver = new webdriver.Builder().
withCapabilities({
	'browserName': 'firefox',
	'platform': 'Windows 7',
	'version': '43.0',
	'username': username,
	'accessKey': accessKey,
	'name': 'App Test',
}).
usingServer("http://" + username + ":" + accessKey + "@ondemand.saucelabs.com:80/wd/hub").build();


console.log('  Testing will be performed using deployed page ' + process.env.APP_URL);
driver.get(process.env.APP_URL);

//Test case 1
driver.getTitle().then(function(title) {
	var element;
	assert.equal(title, 'IBM Cloud Features');
	console.log("Test case 1 [Find page title] \nVerified page title - " + title + "\n");

	//Test case 2
	driver.wait(webdriver.until.elementLocated(webdriver.By.id('tab2')), 5000);
	driver.findElement(webdriver.By.id('tab2')).then(function(tab) {
		tab.click().then(function() {
			driver.wait(webdriver.until.elementLocated(webdriver.By.id('test2header')), 5000);
			element = driver.findElement(webdriver.By.id('test2header'));
			element.getText().then(function(text) {
				assert.equal(text, 'IBM Cloud Architecture');
				console.log("Test case 2 [Find and click second tab]\nHeading found - " + text + "\nVerified navigation to second tab\n");
			});
		});
	});

	//Test case 3
	driver.wait(webdriver.until.elementLocated(webdriver.By.id('tab3')), 5000);
	driver.findElement(webdriver.By.id('tab3')).then(function(tab) {
		tab.click().then(function() {
			driver.wait(webdriver.until.elementLocated(webdriver.By.id('test3header')), 5000);
			element = driver.findElement(webdriver.By.id('test3header'));
			element.getText().then(function(text) {
				assert.equal(text, 'Logs');
				console.log("Test case 3 [Find and click third tab]\nHeading found - " + text + "\nVerified navigation to third tab\n");
			});
		});
	});

	//Test case 4
	driver.wait(webdriver.until.elementLocated(webdriver.By.id('tab1')), 5000);
	driver.findElement(webdriver.By.id('tab1')).then(function(tab) {
		tab.click().then(function() {
			driver.wait(webdriver.until.elementLocated(webdriver.By.id('test1header')), 5000);
			element = driver.findElement(webdriver.By.id('test1header'));
			element.getText().then(function(text) {
				assert.equal(text, 'Presentation');
				console.log("Test case 4 [Find and click first tab]\nHeading found - " + text + "\nVerified navigation to first tab\n");
			});
		});
	});

});

driver.getSession().then(function(sessionid) {
	var sessionId = sessionid.id_;
	console.log("Sauce Labs Session ID: " + sessionId);
	driver.quit();
	saucelabs.updateJob(sessionId, {
		'passed': 'true'
	}, function(err, res) {
		console.log("Sauce Labs Test Job updated to SUCCESS");
	});
});
