var dxInput = angular.module('dextra.input', [ 'dextra.i18n', 'dextra.filter' ]);
dxInput.factory('dxInputMaskConfig', function($filter, dxMasks) {
	var config = {
		configFormater : function(elm, ctrl, maskName) {
			var mask = dxMasks[maskName];
			ctrl.$formatters.push(function(value) {
				if (value) {
					return $filter(maskName)(value);
				}
			});
		},
		configMask : function(elm, ctrl, maskName) {
			var mask = dxMasks[maskName];
			if (!mask) {
				mask = maskName;
			}
		},
		configValidate : function(elm, ctrl, maskName) {
			var mask = dxMasks[maskName];
			elm.bind('keyup', function(event) {
				var value = event.target.value;
				if (value) {

					var filterValue = $filter(maskName)(value);
					var minMaskLength = mask.replace(/9/g, '').length;
					var maxMaskLength = mask.length;

					var valid = value == filterValue && value.length >= minMaskLength && value.length <= maxMaskLength;
					ctrl.$setValidity(maskName, valid);

					if (!isCommandKey(event)) {
						event.target.value = filterValue;
					}

				}
			});
			elm.bind('keydown', function(event) {
				if (!isCommandKey(event) && !isNumericKey(event)) {
					event.preventDefault();
				}
			});
			elm.attr('maxlength', mask.length);
		},
		configAll : function(elm, ctrl, maskName) {
			config.configFormater(elm, ctrl, maskName);
			config.configValidate(elm, ctrl, maskName);
			config.configMask(elm, ctrl, maskName);
		}
	}
	return config;
}).directive('dxDatepicker', function($timeout, $locale, $filter, dxI18n, dxMasks, dxInputMaskConfig) {
	return {
		restrict : 'A',
		require : 'ngModel',
		scope : {
			maxDate : '='
		},
		link : function(scope, elm, attrs, ctrl) {
			var style = attrs.dxDatepicker ? attrs.dxDatepicker : 'medium';
			var maskName = 'date';
			var pattern = dxI18n.getPattern(style, maskName);
			var mask = pattern.replace(/[A-Za-z]/g, '#');
			ctrl.$formatters.push(function(value) {
				return !value ? value : dxI18n.formatDate(new Date(value), pattern);
			});
			ctrl.$parsers.push(function(value) {
				var result = value;
				if (value) {
					try {
						result = dxI18n.parseDate(value, pattern).getTime();
					} catch (e) {
						result = null;
					}
				}
				return result;
			});
			$timeout(function() {
				elm.datepicker({
					dateFormat : dxI18n.getJQueryFormat(pattern),
					onSelect : function(text) {
						if (text != null) {
							ctrl.$setViewValue(text);
							scope.$apply();
						}
					},
					maxDate : scope.maxDate
				});
				elm.bind('keyup', function(event) {
					if (event.target.value) {
						var value = $filter(maskName)(event.target.value);
						var valid = value == event.target.value && value.length == pattern.length;
						try {
							result = dxI18n.parseDate(value, pattern).getTime();
						} catch (e) {
							valid = false;
						}
						ctrl.$setValidity(maskName, valid);
					}
				});
				elm.attr('maxlength', pattern.length);
				dxInputMaskConfig.configMask(elm, ctrl, mask);
			}, 0);
		}
	}
}).directive('dxTimepicker', function($timeout, $filter, dxMasks, dxInputMaskConfig) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			var maskName = 'time';
			var mask = dxMasks[maskName];
			dxInputMaskConfig.configValidate(elm, ctrl, maskName);
			dxInputMaskConfig.configMask(elm, ctrl, maskName);
			ctrl.$formatters.push(function(value) {
				if (value) {
					var date = new Date(value);
					value = date.getHours() + ":" + date.getMinutes();
				}
				return value;
			});
			ctrl.$parsers.push(function(value) {
				if (typeof value == 'string' && value.length > 4) {
					value = value.split(':');

					var date = new Date(0);
					date.setHours(value[0]);
					date.setMinutes(value[1]);

					return date.getTime();
				}
				return value;
			});
			$timeout(function() {
				elm.timepicker({
					showSeconds : false,
					showMeridian : false,
					defaultTime : false,
				}).on('changeTime.timepicker', function(e) {
					if (e.time.value != null && e.time.value.trim() != '') {
						var date = new Date(0);
						date.setHours(e.time.hours);
						date.setMinutes(e.time.minutes);
						value = date.getTime();
						ctrl.$setValidity(maskName, true);
					}
					ctrl.$setViewValue(value);
					scope.$apply();
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
				maxHeight : attrs.maxHeight,
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
			if (scope[attrs.dxMultiselect]) {
				element.multiselect('dataprovider', scope[attrs.dxMultiselect]);
			}
			if (attrs.ngModel) {
				var prefixs = attrs.ngModel.split('.');
				var object = scope;
				for (var i = 0; i < prefixs.length; i++) {
					var p = prefixs[i];
					if (object) {
						object = object[p];
					} else {
						break;
					}
				}
				if (object) {
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
			var expr = attrs.dxFocus ? attrs.dxFocus : 'true';
			var result = scope.$eval(expr);
			if (result) {
				$timeout(function() {
					element.focus();
				}, 0);
			}
		}
	};
}).directive('dxNumeric', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			ctrl.$formatters.push(function(value) {
				if (value || value == 0) {
					return value.toString();
				}
			});
			ctrl.$parsers.push(function(value) {
				if (value) {
					return parseInt(value);
				}
			});
			elm.bind('keydown', function(event) {
				if (!isCommandKey(event) && !isNumericKey(event)) {
					event.preventDefault();
				}
			});
			elm.bind('keyup', function(event) {
				var valid = false;
				if (isCommandKey(event) || isNumericKey(event)) {
					valid = true;
				}
				ctrl.$setValidity('numeric', valid);
			});
		}
	}
}).directive('dxCurrency', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			var maxlength = 20;
			var separator = ',';
			ctrl.$formatters.push(function(value) {
				if (value || value == 0) {
					return value.toString().replace(".", separator);
				}
			});
			ctrl.$parsers.push(function(value) {
				if (value) {
					return parseFloat(value.replace(separator, "."));
				}
			});
			elm.bind('keydown', function(event) {
				var hasSeparator = event.target.value.indexOf(separator) >= 0;
				var decimalSplit = event.target.value.split(separator);
				var intPart = decimalSplit[0];
				var decPart = decimalSplit[1] ? decimalSplit[1] : "";

				if (isCommandKey(event)) {
					return;
				} else if (event.target.value.length + 1 > maxlength) {
					event.preventDefault();
				} else if (isSeparatorKey(event) && hasSeparator) {
					event.preventDefault();
				} else if ((!isNumericKey(event) && !isSeparatorKey(event)) || decPart.length >= 2) {
					event.preventDefault();
				}

			});
			elm.bind('keyup', function(event) {
				var decimalSplit = event.target.value.split(separator);
				var intPart = decimalSplit[0];
				var decPart = decimalSplit[1] ? decimalSplit[1] : "";

				var value = event.target.value.replace(separator, ".");
				var number = value ? parseFloat(value) : 0;

				var valid = number >= 0 && decPart.length <= 2;

				ctrl.$setValidity('currency', valid);
			});
		}
	};
}).directive('dxPercentage', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			var separator = ',';
			ctrl.$formatters.push(function(value) {
				if (value) {
					return value.toString().replace(".", separator);
				}
			});
			ctrl.$parsers.push(function(value) {
				if (value) {
					return parseFloat(value.replace(separator, "."));
				}
			});
			elm.bind('keydown', function(event) {

				var hasSeparator = event.target.value.indexOf(separator) >= 0;
				var decimalSplit = event.target.value.split(separator);
				var intPart = decimalSplit[0];
				var decPart = decimalSplit[1] ? decimalSplit[1] : "";

				if (isCommandKey(event)) {
					return;
				} else if (isSeparatorKey(event) && hasSeparator) {
					event.preventDefault();
				} else if ((!isNumericKey(event) && !isSeparatorKey(event)) || decPart.length >= 2) {
					event.preventDefault();
				}

			});
			elm.bind('keyup', function(event) {

				var decimalSplit = event.target.value.split(separator);
				var intPart = decimalSplit[0];
				var decPart = decimalSplit[1] ? decimalSplit[1] : "";

				var value = event.target.value.replace(separator, ".");
				var number = value ? parseFloat(value) : 0;

				var valid = number <= 100 && number >= 0 && intPart.length <= 3 && decPart.length <= 2;

				ctrl.$setValidity('persentage', valid);

			});
		}
	};
}).directive('dxCpf', function($filter, dxInputMaskConfig) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			dxInputMaskConfig.configAll(elm, ctrl, 'cpf');
		}
	};
}).directive('dxCnpj', function($filter, dxInputMaskConfig) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			dxInputMaskConfig.configAll(elm, ctrl, 'cnpj');
		}
	};
}).directive('dxCep', function($filter, dxInputMaskConfig) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			dxInputMaskConfig.configAll(elm, ctrl, 'cep');
		}
	};
}).directive('dxPhone', function($filter, dxInputMaskConfig) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			dxInputMaskConfig.configAll(elm, ctrl, 'phone');
		}
	};
}).directive(
		'booleanSelect',
		function() {
			return {
				restrict : 'E',
				scope : {
					value : '=',
					trueLabel : '=',
					falseLabel : '='
				},
				replace : true,
				template : '<select data-ng-model="value" required>'
						+ '<option data-ng-selected="value != false" value="true">{{trueLabel}}</option>'
						+ '<option data-ng-selected="value == false" value="false">{{falseLabel}}</option>'
						+ '</select>',
				link : function(scope, element, attrs) {
					if (scope.value == undefined) {
						scope.value = true;
					}
				}
			};
		});

function isCommandKey(event) {

	var controlKeys = [ 8, 9, 13, 27, 35, 36, 37, 38, 39, 46 ];

	// IE doesn't support indexOf
	var isControlKey = controlKeys.join(",").match(new RegExp(event.which));

	// Control keys in most browsers. e.g. Firefox tab is 0
	// Opera assigns values for control keys.
	return isControlKey;

}

function isNumericKey(event) {
	return (48 <= event.which && event.which <= 57) || (96 <= event.which && event.which <= 105);
}

function isSeparatorKey(event) {
	return event.which == 188 || event.which == 108 || event.which == 44;
}
