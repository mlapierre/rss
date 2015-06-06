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

.controller('ArticlesCtrl', ['$document', '$scope', '$routeParams', 'Articles', 'Entry', 'Hotkeys',
  function($document, $scope, $routeParams, Articles, Entry, Hotkeys) {
    if ($routeParams.feedId) {
      $scope.feedId = $routeParams.feedId;
      $scope.articles = Articles.getFromFeed($routeParams.feedId);
    }
    $scope.new_article_tag;
    $scope.selectedIndex = 0;

    $scope.activateArticle = function($index) {
      $scope.selectedIndex = $index;

      var input_elm = angular.element($('#add_article_tag_' + $scope.articles[$index].id));
      Hotkeys.assignHotkeyEvents(input_elm);

      // If the selected article is near the end, fetch more and remove the excess at the top
      Articles.fetchAndTrimIfNeeded($index);
    }

    $scope.addArticleTag = function() {
      var article_id = $scope.articles[$scope.selectedIndex].id;
      var input_scope = angular.element($('#add_article_tag_' + article_id)).scope();
      if (input_scope.add_article_tag_form.$valid) {
        if (!input_scope.article.article_tags) {
          input_scope.article.article_tags = [];
        }
        if (input_scope.article.article_tags.indexOf(input_scope.new_article_tag) >= 0) {
          return;
        }
        input_scope.article.article_tags.push(input_scope.new_article_tag);
        Entry.addTag(article_id, input_scope.new_article_tag);
        $('#add_article_tag_' + article_id).val('');
      } 
    };

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

    $scope.removeArticleTag = function(event) {
      var tag = event.target.parentElement.innerText.trim();
      var article_id = $scope.articles[$scope.selectedIndex].id;
      var input_scope = angular.element($('#add_article_tag_' + article_id)).scope();
      var tag_idx = input_scope.article.article_tags.indexOf(tag);
      input_scope.article.article_tags.splice(tag_idx, 1);
      Entry.removeTag(article_id, tag);
    }
  }
]);
