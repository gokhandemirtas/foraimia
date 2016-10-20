(function () {
	/**
	 * @ngdoc directive
	 * @name prefix:prefix
	 * @description
	 * <ul>
	 * <li>Opens a modal with dropzone directive in it</li>
	 * </ul>
	 * @restrict E
	 * @element
	 */

	angular.module('directives.photoUpload', []).directive('photoUpload', photoUpload);
	/** @ngInject */
	function photoUpload($uibModal, $timeout) {

		var directive = {
			restrict: 'EA',
			replace: true,
			scope:{
				ngModel: '='
			},
			link:linkFunction
		}

		return directive;
		function linkFunction(scope, elem, attrs) {
			scope.$on('UPLOAD_PHOTO', function(event,	callback_fn){
				var modalInstance = $uibModal.open({
					animation: true,
					backdropClass: 'backdrop-zindexed',
					backdrop:'static',
					templateUrl:'app/base/directives/photoUpload.directive.html',
					controller: function($scope){

						$scope.saveDisabled = true;

						$scope.events = {
							save:'',
							chooseAgain:'',
							rotate:'',
							close:function () {
								modalInstance.close()
							},
							enableButton: function(){
								$timeout(function(){
									$scope.saveDisabled = false
								},0)
							},
							disableButton: function(){
								$timeout(function(){
									$scope.saveDisabled = true
								},0)
							}
						};

						$scope.save = function () {
							$scope.events.save()
						};

						$scope.rotate = function () {
							$scope.events.rotate()
						};

						$scope.chooseAgain = function(){
							$scope.events.chooseAgain()
						}

						$scope.close = function(){
							modalInstance.close();
						};
					},
					size: 'md'
				})
			})
		}
	}

})();
