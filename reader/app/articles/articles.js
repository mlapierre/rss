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
    if ($routeParams.feedId) {
      $scope.feedId = $routeParams.feedId;
      $scope.entries = Entries.getFromFeed($routeParams.feedId);
    }
    
    $scope.selectedIndex = 0;

    $scope.activateArticle = function($index) {
      $scope.selectedIndex = $index;

      // If the selected article is near the end, fetch more and remove the excess at the top
      Entries.fetchAndTrimIfNeeded($index);
    }

    $scope.getContent = function(entry) {
      if (!entry.content) {
        return entry.summary;
      } else if (!entry.summary) {
        return entry.content;
      } else if (entry.content.length > entry.summary.length ) {
        return entry.content;
      }
      return entry.summary;
    }

    $scope.isRead = function($index) {
      if ($scope.entries[$index].read_at === null || $scope.entries[$index].read_at === undefined) {
        return false;
      }
      return true;
    }
  }
]);
