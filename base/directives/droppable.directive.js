(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name droppableItem:droppableItem
	 * @description
	 * <ul>
	 * <li>Creates a dropzone for dragged items</li>
	 * </ul>
	 * @restrict E
	 * @element
	 */

	angular.module('directives.droppable', []).directive('droppable', droppable);
	/** @ngInject */
	function droppable($timeout){
		var directive = {
			link:linkFunction,
			scope:{
				events: '=',
				droptarget:'@'
			}
		};
		return directive;

		function linkFunction(scope, elem, attrs) {

			var el = elem[0];

			el.addEventListener('dragover', dragover, false);
			el.addEventListener('dragleave', dragleave, false);
			el.addEventListener('dragenter', dragenter, false);
			el.addEventListener('drop', drop, false);

			function dragover(event){
				cancel(event);
				angular.element(el).addClass('dragover');
			}

			function drop(event){
				var droppableId = event.dataTransfer.getData('Text');
				cancel(event)
				scope.events.drop(droppableId, scope.droptarget)
				angular.element(el).removeClass('dragover')
			}

			function dragleave(event){
				angular.element(el).removeClass('dragover')
				cancel(event)
			}

			function dragenter(event){
				scope.events.dragenter(scope.droptarget);
				cancel(event)
			}

			function cancel(event) {
				if (event.preventDefault) {
					event.preventDefault();
				}
				return false;
			}

		}
	}

})();
