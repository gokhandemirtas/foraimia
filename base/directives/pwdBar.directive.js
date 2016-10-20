(function () {

	'use strict';
	/**
	 * @ngdoc directive
	 * @name directives.pwdBar
	 * @description Displays a password strength bar
	 */

	angular.module('directives.pwdBar', []).directive('pwdBar', pwdBar);
	/** @ngInject */
	function pwdBar() {
		var directive = {
			restrict: 'EA',
			replace: true,
			scope: {
				strength: '@'
			},
			template: '<div class="progress pwd-strength"><div class="progress-bar progress-bar-{{type}} active progress-bar-striped" role="progressbar" style="width:{{perc}}%"></div></div>',
			link: linkFunction
		};
		return directive

		function linkFunction(scope, elm, attrs) {
			scope.type = 'danger';
			scope.perc = 0;
			scope.$watch('strength', function (val) {
				if(val === 1){
					scope.type = 'danger';
					scope.perc = 25;
				} else if (val === 2){
					scope.type = 'warning';
					scope.perc = 50;
				} else if (val === 3){
					scope.type = 'info';
					scope.perc = 75;
				} else if (val === 4) {
					scope.type = 'success';
					scope.perc = 100;
				}
			});
		}
	}
})();
