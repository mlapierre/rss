'use strict';

// Declare app level module which depends on views, and components
angular.module('appConfig', [])
  .constant("settings", {
    "apiUrl": "http://192.168.0.90",
    "apiPort": "3000"
});

angular.module('readerApp', [
  'ngRoute',
  'ngSanitize',
  'ui.bootstrap',
  'appConfig',
  'readerApp.articles',
  'readerApp.view2',
  'readerApp.version',
  'readerAppControllers',
  'readerAppServices'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/articles'});
}]);

