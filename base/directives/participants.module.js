(function() {
	'use strict';

	angular.module('modules.participants',[]).factory('participantsService', ['base', function (base) {
		return _.create(base, { });
	}]).directive('participants', participants);
	/** @ngInject */
	function participants( $translate, $rootScope, participantsService, toastr) {

		var directive = {
			restrict: 'EA',
			replace: false,
			scope:{
				ngModel: '='
			},
			templateUrl:'app/base/directives/participants.module.html',
			link: linkFunction
		};

		return directive;

		function linkFunction(scope, elem, attrs) {

			scope.participants = scope.ngModel || [];
			console.log()

			scope.getParticipants = function (string) {
				return 	participantsService.get('parent/v1/searchRecipient?query='+encodeURIComponent(string)+
					'&school='+attrs.schoolId+'&tiers='+true,{}).then(function (response) {
					return response.data.resultList
				}, function (error) {
				})
			}

			scope.toggleGroup = function(className){
				var el = document.getElementsByClassName(className);
				_.forEach(el, function(item){
					var elm = angular.element(item);
					if(elm.hasClass('visible')){
						elm.removeClass('visible');
						return
					} else { elm.addClass('visible'); }
				})
			}

			function push(r) {
				var includes = _.includes(scope.participants, _.find(scope.participants, {'id':r.id})),
					isMe = r.id === $rootScope.id;
				if(!includes && !isMe){
					scope.participants.push({
						avatar:r.avatar || '',
						firstName:r.firstName || r.field1,
						lastName:r.lastName || r.field2,
						id:r.id,
						type: r.type || 'user',
						tierId: r.tierId || '',
						tierName: r.tierName || ''
					})
					return
				}
				if(includes) {
					toastr.info($translate.instant('ADD_RECIPIENT_ALREADY_EXIST'))
				}
				if(isMe){
					toastr.info($translate.instant('CANT_MESSAGE_SELF'))
				}
			}

			function explode(tierId, tierName){
				participantsService.get('parent/v1/getTierParents?tier='+tierId,{'cache':true}).then(function (response) {
					_.forEach(response.data.resultList, function(r){
						r.type = 'tier';
						r.tierName = tierName;
						r.tierId = tierId;
						push(r)
					})
				}, function (error) {
					error.status === 403 ? toastr.error($translate.instant('CANT_SEE_PUPILS')) : _.noop()
				})
			}

			scope.pickParticipant = function (participant) {
				if(participant.type === 'user'){
					push(participant)
				} else if(participant.type === 'tier'){
					explode(participant.id, participant.field1)
				}
				scope.participant = null;
			}

			scope.removeParticipant = function (participant) {
				$rootScope.$broadcast('REMOVE_PARTICIPANT', participant);
				scope.participants = _.without(scope.participants, participant)
			}

		}
	}
})();
