(function () {

	'use strict';
	/**
    * @ngdoc directive
    * @name directives.pwdStrength
    * @description Tests the pwd
    */
	angular.module('directives.pwdStrength', []).directive('pwdStrength', pwdStrength);
	/** @ngInject */
	function pwdStrength() {
		var directive = {
			require: 'ngModel',
			link: linkFunction
		}
		return directive;

		function linkFunction(scope, elm, attrs, ctrl) {
			ctrl.$parsers.unshift(function (password) {
				var hasUpperCase = /[A-Z]/.test(password);
				var hasLowerCase = /[a-z]/.test(password);
				var hasNumbers = /\d/.test(password);
				var hasNonalphas = /[*-,:.()#$%&@{!^"|_}=<>+?]/.test(password);
				var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas;

				ctrl.strength = characterGroupCount;
				ctrl.hasUpperCase = ctrl.hasLowerCase = ctrl.hasNumbers = ctrl.hasNonalpha = false;

				hasUpperCase ? ctrl.hasUpperCase = true : ctrl.hasUpperCase = false;
				hasLowerCase ? ctrl.hasLowerCase = true : ctrl.hasLowerCase = false;
				hasNumbers ? ctrl.hasNumbers = true : ctrl.hasNumbers = false;
				hasNonalphas ? ctrl.hasNonalphas = true : ctrl.hasNonalphas = false;

				if (characterGroupCount === 4) {
					ctrl.$setValidity('weak', true);
					return password;
				}
				else {
					ctrl.$setValidity('weak', false);
					return undefined;
				}
			})
		}
	}
})();
