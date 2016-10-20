(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name avatar:avatar
	 * @description
	 * <ul>
	 * <li>Display an avatar from given url and dimensions</li>
	 * <li>Listen to refresh event and pull the image again if image has changed</li>
	 * <li>Display default image if url returns no image</li>
	 * </ul>
	 * @restrict E
	 * @element
	 */

	angular.module('directives.avatar', []).directive('avatar', avatar);
	/** @ngInject */
	function avatar($http, $timeout, $compile){
		var directive = {
			restrict: 'EA',
			replace: true,
			scope: {
				width: '@',
				height: '@',
				source:'@'
			},
			templateUrl:'app/base/directives/avatar.directive.html',
			link:linkFunction
		};
		return directive;

		function linkFunction(scope, elem, attrs) {

			var interval = setInterval(function(){
				_.isEmpty(attrs.source) ? _.noop() : recompile()
			}, 300);

			scope.w = attrs.width || 40;
			scope.h = attrs.height ||40;

			function recompile(){
				scope.src = attrs.source;
				$timeout(function(){
					clearInterval(interval);
				},50)
			}

			scope.$watch('source', function(){
				scope.src = attrs.source;
			})

			if(attrs.my === 'true'){
				scope.$on('AVATAR_UPDATE', function(){
					scope.src = attrs.source;
					clearInterval(interval);
					$timeout(function(){
						scope.src = scope.src + '?' + new Date().getTime()
					},50)
				})
			}

		}
	}

})();
