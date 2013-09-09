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
					var msg = 'Condition "' + conditionName + '" never happened within ' + timeout + ' seconds';
					done(msg, null);
				}
				this.clearInterval(attempts);
			}, timeout * 1000);

		});

	};
});
