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

.controller('ArticlesCtrl', ['$scope', '$routeParams', 'Entries', 
  function($scope, $routeParams, Entries) {
    $scope.feedId = $routeParams.feedId;
    $scope.entries = Entries.query({id: $routeParams.feedId, isArray:true});
    
    $scope.selectedIndex = 0;
    $scope.activateArticle = function($index) {
      $scope.selectedIndex = $index;
    }

    $scope.isRead = function($index) {
      if ($scope.entries[$index].read_at === null) {
        return false;
      }
      return true;
    }
  }
]);
