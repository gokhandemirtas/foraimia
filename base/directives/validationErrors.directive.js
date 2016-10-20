(function () {

	'use strict';
	/**
   * @ngdoc directive
   * @name directives.validationErrors
   * @description Displays form validation errors from server
   */
	angular.module('directives.validationErrors', []).directive('validationErrors', validationErrors);
	/** @ngInject */
	function validationErrors(base) {

		var directive = {
			restrict: 'AE',
			replace: true,
			template: '<div class="alert alert-danger" ng-show="notifs.length > 0"><ul><li ng-repeat="err in notifs">{{err.msg}}</li></ul></div>',
			link: linkFunction
		};
		return directive;

		function linkFunction(scope, elem, attrs) {
			scope.notifs = [];
			base.subscribe('badrequest', function(response){
				scope.notifs = [];
				scope.notifs = response;
			});
			scope.$on('$destroy', function () {
				base.unsubscribe('badrequest')
			});
		}
	}

})();
