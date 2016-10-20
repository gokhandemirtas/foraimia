(function () {

	'use strict';
	/**
	* @ngdoc directive
	* @name spinner:spinner
	* @description
	* <ul>
	* <li>Watches for $http.pendingRequests and displays / hides a spinner</li>
	* <li>Flushes all notifications from the previous request</li>
	* </ul>
	* @restrict E
	* @element
	*/
	angular.module('directives.spinner', []).directive('spinner', spinner);
	/** @ngInject */
	function spinner($http, $rootScope, base) {
		var directive =  {
			restrict: 'E',
			replace: true,
			template: '<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>',
			link: linkFunction
		};
		return directive;

		function linkFunction(scope, elem, attrs) {
			scope.$watch(function () {
				return $http.pendingRequests.length > 0;
			},	function (hasPending) {
				if	(hasPendingr) {
					elem.addClass('spinning');
					base.flushAll();
				}
				else	{
					elem.removeClass('spinning');
				}
			});
		}
	}

})();
