angular.module('dextra.input', []).directive('dxNumeric', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			elm.bind('keydown', function(event) {

				var options = $.data(event.target, 'options');
				var value = parseInt(event.target.value);

				var controlKeys = [ 8, 9, 13, 27, 35, 36, 37, 38, 39, 46 ];

				// IE doesn't support indexOf
				var isControlKey = controlKeys.join(",").match(new RegExp(event.which));

				// Control keys in most browsers. e.g. Firefox tab is 0
				if (!event.which ||
				// Always 1 through 9
				(48 <= event.which && event.which <= 57) || (96 <= event.which && event.which <= 105) ||
				// Opera assigns values for control keys.
				isControlKey) {
					return;
				} else {
					event.preventDefault();
				}

			});

		}
	}
}).directive('dxDatepicker', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			var format = attrs.dxDatepicker ? attrs.dxDatepicker : 'dd/mm/yy';
			$(function() {
				elm.datepicker({
					dateFormat : format,
					onSelect : function(date) {
						ctrl.$setViewValue(date);
						scope.$apply();
					}
				});
			});
		}
	}
});
