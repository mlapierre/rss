'use strict';

angular.module('readerApp.articles', ['ngRoute', 'ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/articles', {
    templateUrl: 'articles/articles.html',
    controller: 'ArticlesCtrl'
  })
  .when('/feed/:feedId', {
    templateUrl: 'articles/articles.html',
    controller: 'ArticlesCtrl'
  });  
}])

.controller('ArticlesCtrl', ['$scope', '$routeParams', 'Entry', 
  function($scope, $routeParams, Entry) {
    $scope.feedId = $routeParams.feedId;
    $scope.entries = Entry.query({feedId: $routeParams.feedId, isArray:true});
  }
]);
