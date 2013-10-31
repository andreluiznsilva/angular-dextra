angular.module('dextra.upload', [ 'ng' ]).factory('dxUploader', function($http) {
	return function(url, files) {

		var formData = new FormData();

		if (files) {
			for ( var i = 0; i < files.length; i++) {
				var file = files[i];
				formData.append('file' + i, file, file.name);
			}
		}

		return $http.post(url, formData, {
			headers : {
				'Content-Type' : false
			},
			transformRequest : function(data) {
				return data;
			}
		});

	}

}).directive('dxUpload', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			elm.bind('change', function(event) {
				var files = event.target.files;
				if (files && files.length > 0) {
					ctrl.$setViewValue(files);
					scope.$apply();
				}
			});
		}
	};
})