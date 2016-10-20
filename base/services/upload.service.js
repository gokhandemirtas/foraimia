(function () {
	'use strict';

	angular.module('services.upload',[]).factory('uploadService', uploadService);

	/** @ngInject */
	function uploadService(settings, base, storage, $rootScope, $http) {

		return {
			imgUpload: function (file, config) {
				var fd = new FormData();
				fd.append('fileName', file, settings.imgUpload.name);
				return $http.post(settings.imgUpload.url, fd, config)
			}
		}
	}
})();
