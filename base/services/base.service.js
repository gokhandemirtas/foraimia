(function () {
  'use strict';

  angular.module('services.base',[]).factory('base', base);

  /** @ngInject */
  function base($http, $log, $window, settings) {

    var notifications = {
      'js': [],
      'http':[],
			'badrequest':[]
    }, events = {};

    return {
      isReady: false,
      init: function () {

      },
      post:function (resource, payload, config) {
        return $http.post(settings.gae.url+resource, angular.toJson(payload), _.assign(settings.http, config));
      },
			put:function (resource, payload, config) {
				return $http.put(settings.gae.url+resource, angular.toJson(payload), _.assign(settings.http, config));
			},
			delete:function (resource, config) {
				return $http.delete(settings.gae.url+resource, _.assign(settings.http, config));
			},
      subscribe: function(target, callback_fn){
        events[target] = callback_fn;
      },
			unsubscribe: function(target){
				delete events[target]
			},
      get:function (resource, config) {
        return $http.get(settings.gae.url+resource, _.assign(settings.http, config));
      },
      notify: function (message, target) {
        events[target](message);
        notifications[target].push(message);
      },
      denotify: function (item, target) {
        notifications[target] = _.without(notifications[target], item);

      },
      flushNotifications: function (target) {
        notifications[target].length = 0;
      },
      flushAll: function(){
        notifications['js'].length = 0;
        notifications['http'].length = 0;
      },
      getNotifications: function(target){
        return notifications[target]
      }
    }
  }
})();
