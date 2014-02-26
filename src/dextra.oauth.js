angular.module('dextra.oauth', [ 'ng', 'ngCookies' ]).config(function($httpProvider, $provide) {

	$provide.value("dxOAuthConfig", {});
	$provide.value("dxOAuthExpirationHandler", function() {
	});

	$provide.factory("dxOAuthStorage", function($cookies, $filter) {
		return {
			get : function() {
				return $cookies.oauth ? angular.fromJson($cookies.oauth) : null;
			},
			set : function(oauth) {
				$cookies.oauth = $filter('json')(oauth);
			},
			clear : function(oauth) {
				delete $cookies.oauth;
			}
		};
	});

	$provide.service("dxOAuthService", function(dxOAuthConfig, dxOAuthStorage, dxOAuthExpirationHandler, $q, $http, $timeout) {

		var service = {
			requestConfig : {
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}
		};

		service.isLoggedIn = function() {
			return dxOAuthStorage.get() != null;
		};

		service.login = function(username, password) {

			var body = 'grant_type=password';
			body += '&client_id=' + dxOAuthConfig.clientId;
			body += '&client_secret=' + dxOAuthConfig.clientSecret;
			body += '&username=' + username;
			body += '&password=' + password;

			var deferred = $q.defer();

			$http.post(dxOAuthConfig.tokenEndpoint, body, service.requestConfig).success(function(response) {

				if (response) {

					dxOAuthStorage.set(response);

					service.info().then(function(response) {
						deferred.resolve(response);
					}, function(response) {
						deferred.reject(response);
					});

				} else {
					deferred.reject(response);
				}

			}).error(function(response) {
				deferred.reject(response);
			});

			return deferred.promise;

		};

		service.logout = function() {

			var deferred = $q.defer();

			var url = dxOAuthConfig.tokenEndpoint;

			if (dxOAuthStorage.get()) {
				url += "/" + dxOAuthStorage.get().access_token;
			}

			$http.delete(url, service.requestConfig).success(function(response) {
				deferred.resolve(response);
			}).error(function(response) {
				deferred.resolve(response);
			});
			
			dxOAuthStorage.clear();

			return deferred.promise;

		};

		service.info = function() {

			var deferred = $q.defer();

			var url = dxOAuthConfig.tokenEndpoint + "/" + dxOAuthStorage.get().access_token;

			$http.get(url, service.requestConfig).success(function(response) {
				deferred.resolve(response);
			}).error(function(response) {
				dxOAuthStorage.clear();
				dxOAuthExpirationHandler();
				deferred.reject(response);
			});

			return deferred.promise;

		};
		
		service.addTokenToUrl = function(url) {
			var token = dxOAuthStorage.get().access_token;
			var tokenUrl = url.search('\\?') >= 0 ? '&access_token=' + token : '?access_token=' + token ;
			
			return url + tokenUrl;
		}
		
		return service;

	});

	$httpProvider.interceptors.push(function($injector, $q) {
		return {
			request : function(request) {
				var oauth = $injector.get('dxOAuthStorage').get();
				if (oauth) {
					request.headers['Authorization'] = 'Bearer ' + oauth.access_token;
				}
				return request;
			},
			responseError : function(response) {
				if (response.status == 401) {
					$injector.get('dxOAuthStorage').clear();
					$injector.get('dxOAuthExpirationHandler')();
				}
				return $q.reject(response);
			}
		};
	});

});