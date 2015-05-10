'use strict';

angular.module('readerApp', [
  'ngRoute',
  'ngSanitize',
  'ui.bootstrap',
  'appConfig',
  'duScroll',
  'readerApp.articles',
  'readerApp.view2',
  'readerApp.version',
  'readerAppControllers',
  'readerAppServices'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/articles'});
}]);

