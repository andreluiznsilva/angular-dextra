angular.module('dextra.http', [ 'ng' ]).config(function($httpProvider, $provide) {

	$provide.value("dxLoadingHideHandler", function(response) {
	});
	$provide.value("dxLoadingShowHandler", function(response) {
	});

	$provide.factory("dxErrorHandler", function($log) {
		return function(response) {
			$log.error('Http Error ' + response.status + " : " + response.data);
		}
	});

	$httpProvider.interceptors.push(function(dxErrorHandler, $q) {
		return {
			responseError : function(response) {
				dxErrorHandler(response);
				return $q.reject(response);
			}
		}
	});

	$httpProvider.interceptors.push(function(dxLoadingShowHandler, dxLoadingHideHandler, $q) {
		return {
			request : function(request) {
				dxLoadingShowHandler();
				return request;
			},
			requestError : function(request) {
				dxLoadingHideHandler();
				return $q.reject(request);
			},
			response : function(response) {
				dxLoadingHideHandler();
				return response;
			},
			responseError : function(response) {
				dxLoadingHideHandler();
				return $q.reject(response);
			}
		}
	});

	$httpProvider.interceptors.push(function() {
		return {
			request : function(request) {
				// if get and not a angular bootstrap template
				if (request.method === 'GET' && request.url.indexOf('template') != 0) {
					var sep = request.url.indexOf('?') === -1 ? '?' : '&';
					request.url = request.url + sep + '_=' + new Date().getTime();
				}
				return request;
			}
		}
	});

});