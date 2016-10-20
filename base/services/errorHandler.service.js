(function () {
  'use strict';

  /**
    * @ngdoc function
    * @name error handler
    * @description intercepts Javascript errors and reports
    * #
    */

  angular.module('services.errorHandler', []).factory('$exceptionHandler', exceptionHandler);
  /** @ngInject */
  function exceptionHandler($injector, $log) {
    return function (exception, cause) {
      var service = _.create($injector.get('base'), {}) || {};
			var toastr = _.create($injector.get('toastr'), {}) || {};

      function report() {
				var na = 'N/A',
						obj = {
							exception: exception,
							cause: cause || na,
							stack:exception.stack || na,
							agent: navigator,
							url: stateService.current.name
						};
			}

			$log.error(exception)

			exception.name === 401 ? toastr.error(exception.message) : '';

		}
	}
})();
