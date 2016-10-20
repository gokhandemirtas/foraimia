(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name error handler
	 * @description intercepts $http errors and logs
	 * #
	 */
	angular.module('services.httpInterceptor', []).service('httpInterceptor', httpInterceptor);

	/** @ngInject */
	function httpInterceptor($q, $injector, storage) {

		var authService = function () { return $injector.get('authService') };
		var toastr = function () { return $injector.get('toastr') };

		function err(message, name) {
			this.message = message;
			this.name = name;
		}

		return {
			request : function(config){
				var xhr = config.xhr || false;
				if(_.isString(storage.getToken()) && xhr){
					config.headers['ClasslistToken'] = storage.getToken();
				}
				return config
			},
			response : function(res){
				var valid = res.config.method === 'GET' &&
					res.status === 200 &&
					res.config.url.indexOf('/_ah/api/') > -1 &&
					!_.isUndefined(window.isContainer);

				if (valid){
					storage.set(res.config.url, res.data, true);
				}
				return res
			},
			requestError : function (error) {
				if(error){
					throw new err(error.statusText, error.status)
				}
				return error
			},
			responseError : function (res) {
				switch (res.status) {
					case -1:
						if(res.config.method === 'POST' || res.config.method === 'PUT' || res.config.method === 'DELETE'){
							toastr().error('You are offline, please check your internet connection')
						}
						if (storage.has(res.config.url, true)){
							var data = storage.get(res.config.url, true);
							res.data = angular.fromJson(localStorage.getItem(res.config.url));
							res.status = 200;
							return res;
						}
						break;

					case 401:
						authService().logout()
						break;
				}
				return $q.reject(res);

			}
		}

	}

})();
