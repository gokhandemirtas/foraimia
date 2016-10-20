(function() {
	'use strict';

	angular.module('modules.inbox',[]).factory('inboxService', ['base', function (base) {
		return _.create(base, { });
	}]).controller('inboxController', inboxController);

	/** @ngInject */
	function inboxController($scope, $state, $rootScope) {

		var leftpane = angular.element(document.getElementById('leftpane')),
				rightpane = angular.element(document.getElementById('rightpane'));

		function toggle(visible){
			if(visible === 'left'){
				leftpane.removeClass('hidden-sm').removeClass('hidden-xs');
				rightpane.addClass('hidden-sm').addClass('hidden-xs');
			} else {
				rightpane.removeClass('hidden-sm').removeClass('hidden-xs');
				leftpane.addClass('hidden-sm').addClass('hidden-xs');
			}
		}

		$scope.$on('VIEW_CHANGED', function(evt,args){
			if (matchMedia('only screen and (max-width: 992px)').matches) {
				if(args.to.name === 'inbox.view' && args.toParams.id !== null ){
					toggle('right')
				}
				if(args.to.name === 'inbox.compose'){
					toggle('right')
				}
				if(args.to.name === 'inbox'){
					toggle('left')
				}
			}
		})

		if($state.current.name === 'inbox.compose'){
			if (matchMedia('only screen and (max-width: 992px)').matches) {
				toggle('right')
			}
		}
		if($state.current.name === 'inbox'){
			if (matchMedia('only screen and (max-width: 992px)').matches) {
				toggle('left')
			}
		}
		if($state.current.name === 'inbox.view'){
			if (matchMedia('only screen and (max-width: 992px)').matches) {
				toggle('right')
			}
		}

	}
})();
