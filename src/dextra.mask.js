angular.module('dextra.filter', []).factory('dxMasks', function() {
	return {
		cpf : '000.000.000-00',
		cnpj : '00.000.000/0000-00',
		cep : '00000-000',
		phone : '(00) 0000-00009',
		time : '00:00',
	}
}).filter('mask', function() {
	return function(value, mask) {

		if (value) {

			var input = value + '';
			input = input.replace(/\D/g, "");

			var text = '';
			var j = 0;

			for (var i = 0; i < mask.length; i++) {
				var maskCaracter = mask.charAt(i);
				if (maskCaracter == '0' || maskCaracter == '9') {
					text += input.charAt(j++);
					if (input.length == j) {
						break;
					}
				} else {
					text += maskCaracter;
				}
			}

			value = text;

		}

		return value;

	};
}).filter('cpf', function($filter, dxMasks) {
	return function(text) {
		return $filter('mask')(text, dxMasks['cpf']);
	};
}).filter('cnpj', function($filter, dxMasks) {
	return function(text) {
		return $filter('mask')(text, dxMasks['cnpj']);
	};
}).filter('cep', function($filter, dxMasks) {
	return function(text) {
		return $filter('mask')(text, dxMasks['cep']);
	};
}).filter('phone', function($filter, dxMasks) {
	return function(text) {
		return $filter('mask')(text, dxMasks['phone']);
	};
}).filter('time', function($filter, dxMasks) {
	return function(text) {
		return $filter('mask')(text, dxMasks['time']);
	};
});
