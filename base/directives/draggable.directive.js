(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name draggable:draggable
	 * @description
	 * <ul>
	 * <li>Creates and binds draggable event handlers</li>
	 * </ul>
	 * @restrict E
	 * @element
	 */

	angular.module('directives.draggable', []).directive('draggable', draggable);
	/** @ngInject */
	function draggable($rootScope){
		var directive = {
			scope:{
				dragtarget:'@'
			},
			link:linkFunction
		};
		return directive;

		function linkFunction(scope, elem, attrs) {

			var el = elem[0], handler, isAdded = false;
			el.draggable= true;
			handler = angular.element(el);

			scope.$on('MULTI_SELECT_UP', function(evt,args){
				if(handler.hasClass('pupil-item')){
					var startX = elem[0].offsetLeft+58,
							startY = elem[0].offsetTop+160,
							endX = startX + elem[0].offsetWidth,
							endY = startY + 30,
							isCollision = false;

					isCollision = (startX >= args.startX && startY >= args.startY && endX <= args.endX && endY <= args.endY);

					if(isCollision){
						$rootScope.$broadcast('MUL_PUP_ADDED',scope.dragtarget);
						handler.addClass('selected');
						isAdded = true;
					}
				}
			});

			function handleClick(){
				if(isAdded){
					$rootScope.$broadcast('MUL_PUP_REMOVED',scope.dragtarget);
					handler.removeClass('selected');
					isAdded = false;
				} else {
					$rootScope.$broadcast('MUL_PUP_ADDED',scope.dragtarget);
					handler.addClass('selected');
					isAdded = true;
				}
			}

			el.addEventListener('click', handleClick)

			el.addEventListener('touchmove', function(event) {
				var touch = event.targetTouches[0];
				draggable.style.position = 'absolute';
				draggable.style.left = touch.pageX-25 + 'px';
				draggable.style.top = touch.pageY-25 + 'px';
				event.preventDefault();
			}, false);

			el.addEventListener('dragstart',function(e) {
					e.dataTransfer.effectAllowed = 'move';
					e.dataTransfer.setData('Text', scope.dragtarget);
					return false;
				}, false
			);

			el.addEventListener('drag',function(e) {
					handler.addClass('dragging');
					return false;
				}, false
			);

			el.addEventListener('dragend',function(e) {
					handler.removeClass('dragging');
					return false;
				}, false
			);

		}
	}

})();
