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

.controller('ArticlesCtrl', ['$scope', '$routeParams', 'Articles',
  function($scope, $routeParams, Articles) {
    if ($routeParams.feedId) {
      $scope.feedId = $routeParams.feedId;
      $scope.articles = Articles.getFromFeed($routeParams.feedId);
    }
    
    $scope.selectedIndex = 0;

    $scope.activateArticle = function($index) {
      $scope.selectedIndex = $index;

      // If the selected article is near the end, fetch more and remove the excess at the top
      Articles.fetchAndTrimIfNeeded($index);
    }

    $scope.getContent = function(article) {
      if (!article.content) {
        return article.summary;
      } else if (!article.summary) {
        return article.content;
      } else if (article.content.length > article.summary.length ) {
        return article.content;
      }
      return article.summary;
    }

    $scope.isRead = function($index) {
      if ($scope.articles[$index].read_at === null || $scope.articles[$index].read_at === undefined) {
        return false;
      }
      return true;
    }
  }
]);
