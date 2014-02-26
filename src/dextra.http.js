angular.module('dextra.http', [ 'ng' ]).config(function($httpProvider, $provide) {

	$provide.value("dxDevMode", false);

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

	$httpProvider.interceptors.push(function(dxLoadingShowHandler, dxLoadingHideHandler, $q, $log) {
		var interceptor = {
			request : function(request) {
				if (interceptor.count == 0) {
					dxLoadingShowHandler();
				}
				interceptor.count++;
				return request;
			},
			requestError : function(request) {
				interceptor.count--;
				if (interceptor.count == 0) {
					dxLoadingHideHandler();
				}
				return $q.reject(request);
			},
			response : function(response) {
				interceptor.count--;
				if (interceptor.count == 0) {
					dxLoadingHideHandler();
				}
				return response;
			},
			responseError : function(response) {
				interceptor.count--;
				if (interceptor.count == 0) {
					dxLoadingHideHandler();
				}
				return $q.reject(response);
			}
		}
		interceptor.count = 0;
		return interceptor;
	});

});