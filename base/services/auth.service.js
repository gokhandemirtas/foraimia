(function () {
	'use strict';

	angular.module('services.auth',[]).factory('authService', authService);

	/** @ngInject */
	function authService($window, settings, toastr, storage, base, $translate) {

		function flush(){
			storage.del('tkn',true);
			storage.del('status',true);
		}

		return {
			logout: function () {
				toastr.info($translate.instant('LOGOUT_PROCESS'));
				if(!_.isNull(storage.getToken())){
					var tkn = storage.getToken();
					base.post('sso/v1/signOut',{},{'headers':{'ClasslistToken':tkn}}).then(function (response) {
						$window.location = settings.conf.ssoAppURL;
					}, function(error){
						toastr.error($translate.instant('LOGOUT_FAILED'))
					})
				} else {
					$window.location = settings.conf.ssoAppURL;
				}
				flush();
			}
		}
	}
})();
