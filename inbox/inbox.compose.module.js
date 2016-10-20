(function() {
	'use strict';

	angular.module('modules.inbox.compose',[]).controller('inboxComposeController', inboxComposeController);

	/** @ngInject */
	function inboxComposeController($scope, $rootScope, $timeout, inboxService, context, $state, $stateParams, toastr, regexes) {
		$scope.viewState = {
			isReady:true
		};
		$scope.regexes = regexes;
		$scope.participants = [];

		$scope.message = {
			subject:'',
			body:'',
			participants:[]
		};

		function addParticipant(obj){
			var valid = false;
			valid = !_.includes($scope.participants, _.find($scope.participants, {'id':obj.id})) &&
							obj.id !== $rootScope.id &&
							_.has(obj, 'firstName') &&
							_.has(obj, 'lastName') &&
							_.has(obj, 'id');
			if(valid) {
				$scope.participants.push(obj)
			}
		}

		$scope.openAddParticipantsModal	=	function(){
			$scope.$emit('ADD_PARTICIPANT',	{
				callback:addParticipant,
				participants:$scope.participants,
				schoolId:context.data.school.id || '',
				addBulk:false,
				eventContext:false
			});
		};

		$scope.$on('REMOVE_PARTICIPANT', function(evt, args){
			$timeout(function(){
				$scope.participants = _.without($scope.participants, _.find($scope.participants, {'id':args.id}));
			},0)
		})

		if($stateParams.firstName){
			addParticipant({
				firstName:$stateParams.firstName || '',
				lastName:$stateParams.lastName || '',
				id:$stateParams.id || '',
				avatar:$stateParams.avatar || ''
			})
		}

		$scope.send = function(){
			var obj = angular.copy($scope.message);
			obj.participants = _.map($scope.participants, 'id');
			$scope.viewState.isReady = false;
			inboxService.post('parent/v1/startConversation',obj,{}).then(function(response){
				$scope.viewState.isReady = true;
				$state.go('inbox.view',{'id':response.data.conversation.id});
				$rootScope.$broadcast('GET_CONVERSATIONS', {'conversation':response.data.conversation});
			}, function(error){
				(error.status !== -1 ) ? toastr.error(error) : _.noop();
				$scope.viewState.isReady = true;
			})
		}

	}
})();
