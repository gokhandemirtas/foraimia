(function() {
	'use strict';

	angular.module('modules.inbox.view',[]).controller('inboxViewController', inboxViewController);

	/** @ngInject */
	function inboxViewController($scope, $timeout, $rootScope, $stateParams, context, $uibModal, inboxService, regexes) {
		$scope.regexes = regexes;
		$scope.conversation = {
			messages:[],
			subject:''
		};
		$scope.creator = {
			id:'',
				firstName:'',
				lastName:'',
				avatar:''
		};
		$scope.participants = [];
		$scope.body = '';
		$scope.viewState = {
			isReady:true
		};
		var cursor = '';

		getParticipants($stateParams.id);
		getMessages($stateParams.id);

		function getp(){
			return angular.copy($scope.participants)
		}

		function addParticipants(arr){
			$scope.viewState.isReady = false;
			inboxService.post('parent/v1/addConversationParticipants',{
				'conversationId':$stateParams.id,
				'participants': _.map(arr, 'id')
			},{}).then(function(response){
				$scope.viewState.isReady = true;
				getParticipants($stateParams.id);
				getMessages($stateParams.id);
				$rootScope.$broadcast('GET_CONVERSATIONS',{});
			}, function(error){
				$scope.viewState.isReady = true;
			})
		}

		$scope.showParticipants = function(){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/inbox/views/show-participants-modal.html',
				backdropClass: 'backdrop-zindexed',
				size:'sm',
				controller: function($scope){
					$scope.participants = getp();

					$scope.eventContext = false;

					$scope.close = function(){
						modalInstance.close();
					}
					$scope.openAddParticipantsModal	=	function(){
						$scope.$emit('ADD_PARTICIPANT',	{
							callback:addParticipants,
							schoolId:context.data.school.id || '',
							addBulk:true
						});
					};
				}
			})
		}

		$scope.openAddParticipantsModal	=	function(){
			$scope.$emit('ADD_PARTICIPANT',	{
				callback:addParticipants,
				schoolId:context.data.school.id || '',
				addBulk:true
			});
		};

		function getParticipants(id){
			inboxService.get('parent/v1/getConversationParticipants?conversationId='+id,{'cache':false}).then(function (response) {
				$scope.participants = response.data.participants;
				$scope.creator = response.data.creator;
			}, function (error) {
			})
		}

		function getMessages (id) {
			$scope.viewState.isReady = false;
			inboxService.get('parent/v1/getConversationMessages?conversationId='+id,{}).then(function (response) {

				var data = response.data;

				$scope.conversation.messages = data.messages;
				$scope.conversation.subject = data.subject;

				$rootScope.$broadcast('GET_UNREAD_COUNT');
				$rootScope.$broadcast('CONVERSATION_READ',{'id':id});

				cursor = data.cursor || '';
				$timeout(function(){
					scroll();
				}, 1000);
				$scope.viewState.isReady = true;
			}, function (error) {
				$scope.viewState.isReady = true;
			})
		}

		function scroll(){
			var scroller = document.getElementById('autoscroll');
			scroller.scrollTop = scroller.scrollHeight;
		}

		function virtualUpdate(_body){
			$scope.conversation.messages.push({
				senderId:context.data.user.id,
				senderFirstName:context.data.user.firstName,
				senderLastName:context.data.user.lastName,
				timestamp: new Date(),
				body:_body,
				senderAvatar:context.data.user.avatar
			});
			$timeout(function(){
				scroll()
			},100)
		}

		$scope.send = function (id) {
			$scope.viewState.isReady = false;
			inboxService.post('parent/v1/replyToConversation',{
				'body':$scope.body,
				'conversationId':$stateParams.id,
				'cursor':cursor
			}).then(function (response) {
				$scope.viewState.isReady = true;
				virtualUpdate($scope.body);
				$scope.body = '';
			}, function(error){

			})
		}

	}
})();
