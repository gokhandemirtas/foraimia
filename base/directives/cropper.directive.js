(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name filereader:filereader
	 * @description
	 * <ul>
	 * <li>Uses HTML5 filereader API</li>
	 * <li>Attaches Cropper JS to the upload result</li>
	 * </ul>
	 * @restrict E
	 * @element
	 */

	function dataURItoBlob(dataURI) {
		var byteString = atob(dataURI.split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: 'image/jpeg' });
	}

	angular.module('directives.cropper', []).directive('cropper', cropper);
	/** @ngInject */
	function cropper(settings, storage, toastr, $translate, $rootScope, uploadService){
		var directive = {
			restrict: 'EA',
			replace: true,
			scope:{
				events: '='
			},
			templateUrl:'app/base/directives/cropper.directive.html',
			link:linkFunction
		};
		return directive;

		function linkFunction(scope, elem, attrs) {

			scope.viewState = {
				isReady:true
			};

			var imgUploader = document.getElementById('imgUploader'),
					imgPreviewer = document.getElementById('imgPreviewer'),
					imgPlaceholder = document.getElementById('imgPholder'),
					cropper;

			function handleLoad(){
				var	file	= imgUploader.files[0], reader	=	new	FileReader();

				reader.addEventListener('load', function () {
					handleImage(reader.result);
				}, false);

				if (file) {
					reader.readAsDataURL(file);
				}
			}

			function showPholder(){
				imgPlaceholder.style.display = 'block';
			}
			function hidePholder(){
				imgPlaceholder.style.display = 'none';
			}

			function handleImage(blob){
				var img = document.createElement('img');
				img.src = blob;

				img.addEventListener('load', function() {
					if(img.width > settings.imgUpload.maxWidth){

						hidePholder();

						var canvas = document.createElement('canvas'),
							ratio = settings.imgUpload.maxWidth / img.width,
							context;
						canvas.width  = settings.imgUpload.maxWidth;
						canvas.height = img.height * ratio;

						context = canvas.getContext('2d');
						context.drawImage(img, 0, 0, settings.imgUpload.maxWidth, (img.height * ratio));
						imgPreviewer.src = canvas.toDataURL('image/jpeg',settings.imgUpload.quality);
						attachCropper(imgPreviewer)
					}
					if((img.width > settings.imgUpload.minWidth) && (img.width < settings.imgUpload.maxWidth)) {
						hidePholder();
						imgPreviewer.src = blob;
						attachCropper(imgPreviewer)
					}
					if(img.width < settings.imgUpload.minWidth){
						toastr.error($translate.instant('DZ_PHOTO_TOO_SMALL'));
						scope.events.disableButton();
					}
				});

			}

			function exporter(){
				var output = document.createElement('img'),
					canvas = document.createElement('canvas'),
					context = canvas.getContext('2d');

				canvas.height = canvas.width = settings.imgUpload.minWidth;
				output.src = cropper.getCroppedCanvas().toDataURL();
				output.onload = function(){
					context.drawImage(output, 0, 0, settings.imgUpload.minWidth, settings.imgUpload.minWidth);
					var optimized = canvas.toDataURL('image/jpeg',settings.imgUpload.quality);
					scope.viewState.isReady = false;
					scope.events.disableButton();
					uploadService.imgUpload(dataURItoBlob(optimized),{
						headers: {
							'Content-Type': undefined,
							'ClasslistToken':storage.getToken() || '',
							'ClasslistCfg':angular.toJson({
								'type':'PROFILE_PIC',
								'id':$rootScope.id || ''
							})
						}
					}).then(function(response){
						$rootScope.$broadcast('AVATAR_UPDATE');
						scope.viewState.isReady = true;
						scope.events.close();
					}, function(error){
						scope.viewState.isReady = true;
						scope.events.enableButton();
					})
				}
			}

			scope.events.rotate = function(){
				cropper.rotate(45)
			}

			scope.events.save = function() {
				exporter()
			}

			scope.events.chooseAgain = function () {
				cropper.destroy();
				imgPreviewer.src = '';
				scope.events.disableButton();
				showPholder()
			}

			function attachCropper(image){
				scope.events.enableButton();
				cropper ? cropper.destroy() : _.noop();
				cropper = new Cropper(image, settings.cropper)
			}

			imgUploader.onchange = function(){
				handleLoad()
			}

		}
	}

})();
