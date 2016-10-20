(function () {
	'use strict';

	angular.module('services.ganalytics',[]).factory('gaService', gaService);

	/** @ngInject */
	function gaService($window, settings) {

		$window.ga('create', settings.gaUserId, 'auto');
		$window.ga('set', 'forceSSL', true);

		return {
			send: function (page) {
				$window.ga('send', 'pageview', page);
			}
		}
	}
})();
