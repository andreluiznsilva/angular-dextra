angular.scenario.dsl('waitFor', function() {
	return function(conditionName, condition, timeout) {

		var msg = 'Waiting for "' + conditionName + '" to happen for ' + timeout + " seconds";
		this.addFutureAction(msg, function(appWindow, $document, done) {

			var doneFlag = false;
			var attempts = appWindow.top.setInterval(function() {
				if (condition($document, appWindow) === true) {
					doneFlag = true;
					appWindow.top.clearInterval(attempts);
					done(null, doneFlag);
				}
			}, 100);

			appWindow.top.setTimeout(function() {
				if (!doneFlag) {
					var msg = 'Condition "' + conditionName + '" never happened within ' + timeout
							+ ' seconds, attempts: ' + attempts;
					done(msg, null);
				}
				this.clearInterval(attempts);
			}, timeout * 1000);

		});

	};
});

angular.scenario.dsl('waitForPageLoadComplete', function() {
	return function(timeout) {
		waitFor("Page load complete", function(doc, appWindow) {
			return appWindow.document.readyState == 'complete';
		}, timeout);
	};
});

angular.scenario.dsl('waitForElementToBeSelected', function() {
	return function(selector, timeout) {
		waitFor("Element " + selector + " to be selected", function() {
			return element(selector) != null;
		}, timeout);
	};
});

angular.scenario.dsl('waitForElementById', function() {
	return function(selector) {
		waitFor("Element " + selector, function(doc, appWindow) {
			return appWindow.document.getElementById(selector) != null;
		}, 10);
	};
});

angular.scenario.dsl('fillInputs', function() {
	return function(object, prefix) {
		prefix = prefix ? prefix + '.' : '';
		for ( var prop in object) {
			var value = object[prop];
			input(prefix + prop).enter(value);
		}
	};
});