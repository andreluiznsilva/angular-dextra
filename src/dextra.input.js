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
					onSelect : function(value) {
						if (value != null) {
							var date = $.datepicker.parseDate(format, value).getTime();
							ctrl.$setViewValue(date);
							scope.$apply();
						}
					}
				});
			});
		}
	}
}).directive('dxDatepickerOld', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			$(function() {
				elm.datepicker({
					dateFormat : 'dd/mm/yy',
					onSelect : function(value) {
						if (value != null) {
							ctrl.$setViewValue(value);
							scope.$apply();
						}
					}
				});
			});
		}
	}
}).directive('dxMultiselect', function($timeout) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
				element.multiselect({
					buttonClass : 'btn',
					buttonWidth : 'auto',
					maxHeight: attrs.maxHeight,
					includeSelectAllOption : true,
					selectAllText : 'Selecionar todos',
					selectAllValue : '',
					buttonContainer : '<div class="btn-group" />',
					buttonText : function(options) {
						if (options.length == 0) {
							return 'Nenhum selecionado <b class="caret"></b>';
						} else if (options.length > 3) {
							return options.length + ' selecionados  <b class="caret"></b>';
						} else {
							var selected = '';
							options.each(function() {
								selected += $(this).text() + ', ';
							});
							return selected.substr(0, selected.length - 2) + ' <b class="caret"></b>';
						}
					}
			});
			if(scope[attrs.dxMultiselect]){
				element.multiselect('dataprovider', scope[attrs.dxMultiselect]);
			}
			if(attrs.ngModel){
				var prefixs = attrs.ngModel.split('.');
				var object = scope;
				for ( var i = 0; i < prefixs.length; i++) {
					var p = prefixs[i];
					if (object) {
						object = object[p];
					} else {
						break;
					}
				}
				if(object){
					element.multiselect('select', object);
				}
			}
		}
	}
}).directive('dxReadonly', function() {
	return {
		restrict : 'A',
		link : function(scope, element, attr) {
			var result = scope.$eval(attr.dxReadonly);
			if (result) {
				element.find('select, input, textarea, button').attr('readonly', true).attr('disabled', true);
			}
		}
	};
}).directive('dxFocus', function($timeout) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			var expr = attrs.dxFocus ?  attrs.dxFocus : 'true';
			var result = scope.$eval(expr);
			if (result) {
				$timeout(function() {
					element.focus();
				}, 0);
			}
		}
	};
}).directive('dxCurrency', function() {
    return {
        restrict: 'A',
        scope: {
            field: '='
        },
        replace: true,
        template: '<input type="text" ng-model="field"></input>',
        link: function(scope, element, attrs) {

            $(element).bind('keyup', function(e) {
                var input = element.find('input');
                var inputVal = input.val();

                //clearing left side zeros
                while (scope.field.charAt(0) == '0') {
                    scope.field = scope.field.substr(1);
                }

                scope.field = scope.field.replace(/[^\d.\',']/g, '');

                var point = scope.field.indexOf(".");
                if (point >= 0) {
                    scope.field = scope.field.slice(0, point + 3);
                }

                var decimalSplit = scope.field.split(".");
                var intPart = decimalSplit[0];
                var decPart = decimalSplit[1];

                intPart = intPart.replace(/[^\d]/g, '');

                if (decPart === undefined) {
                    decPart = "";
                }
                else {
                    decPart = "." + decPart;
                }
                var res = intPart + decPart;

                scope.$apply(function() {scope.field = res});

            });

        }
    };
});
