'use strict';

angular.module('komApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
