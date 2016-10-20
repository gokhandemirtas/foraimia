(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name prefix:prefix
	 * @description
	 * <ul>
	 * <li>Displays a recursive list of tiers, with nested sub tiers</li>
	 * <li>Updates the model with selected tiers ID</li>
	 * </ul>
	 * @restrict E
	 * @element
	 */

	angular.module('directives.classPicker', []).directive('classPicker', classPicker);
	/** @ngInject */

	function classPicker(base, $timeout, $translate){
		var directive = {
			restrict: 'E',
			replace: true,
			scope:{
				ngModel: '='
			},
			templateUrl:'app/base/directives/classPicker.directive.html',
			link: linkFunction
		};
		return directive

		function linkFunction(scope, elem, attrs) {

			scope.tier = {};
			scope.showTiers = false;

			var i8n = {
				BACK: $translate.instant('BACK_BTN'),
				YEAR_NOT_SURE:$translate.instant('YEAR_NOT_SURE'),
				YEAR_NOT_FOUND: $translate.instant('YEAR_NOT_FOUND')
			};

			var container = angular.element(document.querySelector('#class-picker')),
				topTier = angular.element(document.querySelector('#tier-1'));

			function showSub(openerid, targetid) {
				var opener = angular.element(document.querySelector('#'+openerid)),
					target = angular.element(document.querySelector('#'+targetid));
				target.removeClass('hide').addClass('display');
				opener.removeClass('display').addClass('hide');
			}

			function traverse(data, _target) {
				_.forEach(data, function (node) {
					var li = angular.element('<li/>'),
						a = angular.element('<a/>'),
						target = angular.element(_target),
						openerid = target.attr('id') || '',
						targetid = 'tier-'+node.id;

					var hasChildren = (node.children && node.children.length > 0) || false;

					if(node.translation){
						a.text(i8n[node.translation])
					} else {
						a.text(node.name);
					}

					a.bind('click',function () {
						if(hasChildren){
							showSub(openerid, targetid);
						} else {
							scope.selectTier(node)
						}
					});
					li.append(a);
					target.append(li);

					if(hasChildren){
						var ul = angular.element('<ul/>'),
							chevron = angular.element('<span/>'),
							back = angular.element('<a/>');

						chevron.addClass('dripicons-arrow-thin-right next pull-right');
						back.addClass('prev').text(i8n['BACK']);
						back.bind('click', function () {
							showSub(targetid, openerid)
						});
						ul.addClass('sub');
						ul.attr('id','tier-'+node.id);
						ul.append(back);
						a.append(chevron);
						container.append(ul);
						traverse(node.children, ul);
					}
				})
			}

			base.get('parent/v1/getSchoolStructure', {'cache':false}).then(function (response) {
				traverse(response.data.items, topTier);
			}, function (error) {});

			scope.selectTier = function (tier) {
				$timeout(function () {
					scope.ngModel = tier;
				},0);
				scope.showTiers = false;
				scope.tier = tier;
			};
		}

	}
})();

