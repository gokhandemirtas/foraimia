(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name prefix:prefix
	 * @description
	 * <ul>
	 * <li>Displays list of country prefixes</li>
	 * <li>Flushes all notifications from the previous request</li>
	 * </ul>
	 * @restrict E
	 * @element
	 */

	angular.module('directives.countries', []).directive('countries', countries);
	/** @ngInject */
	function countries(base){
		var directive = {
			restrict: 'EA',
			replace: true,
			scope:{
				ngModel: '='
			},
			template: [
				'<select class="form-control" ng-required="isRequired">',
				'<option ng-repeat="c in countries" value="{{::c.id}}">{{::c.longName}}</option>',
				'</select>'
			].join(''),
			link:linkFunction
		};
		return directive;

		function linkFunction(scope, elem, attrs) {
			scope.countries = [];
			scope.isRequired=scope.$eval(attrs.isRequired);
			scope.ngModel === '' ? scope.ngModel = '826' : '';

			base.get('shared/v1/getMetaData?language=en-GB', {'cache':true}).then(function(response){
				scope.countries = response.data.metadata.countries;
			});
		}
	}

})();
