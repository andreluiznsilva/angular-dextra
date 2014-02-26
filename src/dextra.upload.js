angular.module('dextra.upload', [ 'ng' ]).factory('dxUploader', function($http) {
	return {

		upload : function(url, files) {

			var formData = new FormData();

			if (files) {

				var array = files;

				if (!angular.isArray(files)) {
					array = [];
					array.push(files);
				}

				angular.forEach(array, function(file, index) {
					formData.append('file' + index, file, file.name);
				});

			}

			return $http.post(url, formData, {
				headers : {
					'Content-Type' : undefined
				},
				transformRequest : function(data) {
					return data;
				}
			});

		},

		check : function(callback) {
			var nav = navigator.userAgent.toLowerCase();
			if (nav.indexOf('msie') != -1) {
				var version = parseFloat(nav.split('msie')[1]);
				if (version <= 9) {
					callback(version);
				}
			}
		}

	}

}).directive('dxUpload', function() {
	return {
		restrict : 'A',
		link : function(scope, elm, attrs, ctrl) {

			var name = attrs.dxUpload;

			$(elm).change(function(event) {

				var files = event.target.files;

				if (files && files.length > 0) {
					var value = attrs.multiple ? files : files[0];
					scope[name] = value;
					scope.$apply();
				}

			});

		}
	};
})