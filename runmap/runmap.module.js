(function() {
	'use strict';

	angular.module('modules.runmap',[]).factory('runmapService', ['base', function (base) {
		return _.create(base, { });
	}]).controller('runmapController',runmapController);

	/** @ngInject */
	function runmapController($scope, context, metadata, runmapService, $uibModal) {

		$scope.mapConfig = {};
		$scope.parentDetails = {};

		$scope.viewState = {
			isReady:true,
			isParentVisible:false
		};

		var relationships = {};

		_.each(metadata.data.metadata.relationships, function (obj, index) {
			relationships[obj.id] = obj.longName;
		});

		$scope.toggleParentOverlay = function(){
			$scope.viewState.isParentVisible = !$scope.viewState.isParentVisible
		}

		function showModal(){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/runmap/views/not-on-runmap.html',
				size:'sm',
				backdrop:'static',
				backdropClass: 'backdrop-zindexed',
				controller: function($scope){
					$scope.close = function(){
						modalInstance.close();
					};
				}
			})
		}

		function getMapConfig(){
			runmapService.get('parent/v1/getRunSchoolShare?schoolId='+context.data.school.id,{'cache':false}).then(function(response){
				$scope.mapConfig = response.data;
				!response.data.currentParent.enabled ? showModal() : _.noop();
			}, function(error){

			})
		};

		function getParent(id){
			runmapService.get('parent/v1/getClasslistParentDetails?id='+id,{'cache':false}).then(function (response) {
				var data = response.data;
				data.relationship = relationships[data.relationshipId] || '';
				$scope.parentDetails = data;
				$scope.viewState.isParentVisible = true;
			}, function(error){

			})
		}

		$scope.$on('SHOW_MAP_PARENT', function(evt,args){
			getParent(args.id)
		})

		getMapConfig()

	}
})();
