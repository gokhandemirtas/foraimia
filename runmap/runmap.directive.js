(function () {

	'use strict';
	/**
	 * @ngdoc directive
	 * @name runmap:runmap
	 * @description
	 * <ul>
	 * <li>Displays a Google Maps</li>
	 * <li>Centers the map on parent</li>
	 * <li>Displays pins on the map from a parents array lat-long pairs</li>
	 * </ul>
	 * @restrict E
	 * @element
	 */
	angular.module('directives.runmap', []).directive('runmap', runmap);
	/** @ngInject */
	function runmap(settings, $timeout) {

		var directive =  {
			restrict: 'EA',
			replace:true,
			scope:{
				config:'='
			},
			template:'<aside id="map"></aside>',
			link: linkFunction
		};

		return directive;

		function linkFunction(scope, elem, attrs) {

			var map;

			function addMarker(parent, isMe){
				if(parent.lat && parent.lng && parent.id){
					var marker = new google.maps.Marker({
						position: {'lat':parent.lat, 'lng':parent.lng},
						icon: (isMe ? 'assets/images/map-marker-me.svg' : 'assets/images/map-marker.svg'),
						animation: google.maps.Animation.DROP,
						map: map
					});
					marker.addListener('click', function(){
						scope.$emit('SHOW_MAP_PARENT', {'id':parent.id})
					})
				}
			}

			function init(config){
				var myPos = {'lat':parseFloat(config.currentParent.lat), 'lng':parseFloat(config.currentParent.lng)};
				map = new google.maps.Map(elem[0], {
					center: myPos || settings.runmap.default.london,
					zoom: settings.runmap.zoom
				});

				if(config.parents.length > 0){
					_.forEach(config.parents, function(parent){
						addMarker(parent, false)
					})
				}

				addMarker(config.currentParent, true)
			}

			scope.$watch('config', function(newVal){
				!_.isUndefined(newVal) && newVal.currentParent ? init(newVal) : _.noop()
			})

		}
	}

})();
