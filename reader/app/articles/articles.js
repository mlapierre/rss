'use strict';

angular.module('readerApp.articles', ['ngRoute', 'ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/feed/:feedId', {
    templateUrl: 'articles/articles.html',
    controller: 'ArticlesCtrl'
  });  
}])

.directive('onFinishRender', function ($timeout) {
  return {
      restrict: 'A',
      link: function (scope, element, attr) {
          if (scope.$last === true) {
              $timeout(function () {
                  scope.$emit(attr.onFinishRender);
              });
          }
      }
  }
})

.controller('ArticlesCtrl', ['$document', '$timeout', '$scope', '$routeParams', 'Articles', 'Entry', 'Hotkeys', 'Feed',
  function($document, $timeout, $scope, $routeParams, Articles, Entry, Hotkeys, Feed) {
    if ($routeParams.feedId) {
      $scope.feedId = $routeParams.feedId;
      $scope.articles = Articles.getFromFeed($routeParams.feedId);
    }
    $scope.new_article_tag;
    $scope.selectedIndex = 0;

    $scope.$on('bindHotkeys', function() {
      var selected_article_id = $scope.articles[$scope.selectedIndex].id;
      var input_elm = angular.element($('#add_article_tag_' + selected_article_id));
      Hotkeys.assignHotkeyEvents(input_elm);    
    });    

    $scope.activateArticle = function($index) {
      $scope.selectedIndex = $index;

      var input_elm = angular.element($('#add_article_tag_' + $scope.articles[$index].id));
      Hotkeys.assignHotkeyEvents(input_elm);

      // If the selected article is near the end, fetch more and remove the excess at the top
      // var old_article_id = $scope.articles[$index].id;
      // Articles.fetchAndTrimIfNeeded($index);
      // var article_elm = angular.element($('#article_' + old_article_id));
      //angular.element($('#articles_panel')).scrollToElement(article_elm, 7, 50);
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

    $scope.isRead = function(index) {
      if ($scope.articles[index].read_at === null || $scope.articles[index].read_at === undefined) {
        return false;
      }
      return true;
    }

    $scope.selectNext = function() {
      if (!$scope.isRead($scope.selectedIndex)) {
        Feed.decrementCurrentFeedCount();
        markSelectedArticleRead();
        hideSelectedArticle();
      }

      if ($scope.selectedIndex !== $scope.$$childTail.$index) {
        $scope.selectedIndex++;
        $scope.$apply();
      }
      var selected_article_id = $scope.articles[$scope.selectedIndex].id;
      scrollToEntry(selected_article_id);
      var input_elm = angular.element($('#add_article_tag_' + selected_article_id));
      Hotkeys.assignHotkeyEvents(input_elm);    

      var unread_count = Feed.currentFeedCount();
      if (unread_count > 0
          && (unread_count - ($scope.$$childTail.$index - $scope.selectedIndex + 1) > 0)
          && $scope.selectedIndex > ($scope.articles.length - 6)) {
        Articles.fetch($scope.articles, 
                       $scope.feedId, 
                       Math.min(5, unread_count),
                       function() { 
                        setSelectedIndex(selected_article_id); 
                        var input_elm = angular.element($('#add_article_tag_' + selected_article_id));
                        Hotkeys.assignHotkeyEvents(input_elm);    
                       } );
      }
    }

    $scope.selectPrev = function() {
      if ($scope.selectedIndex - 1 < 0) {
        $scope.selectedIndex = 0;
      } else {
        $scope.selectedIndex--;
      }
      $scope.$apply();

      if ($scope.isRead($scope.selectedIndex)) {
        Feed.incrementCurrentFeedCount();
        markSelectedArticleUnread();
        showSelectedArticle();
      }

      var input_elm = angular.element($('#add_article_tag_' + $scope.articles[$scope.selectedIndex].id));
      Hotkeys.assignHotkeyEvents(input_elm);    
    }
   
    $scope.toggleRead = function() { 
      // var entry = articles_scope.articles[articles_scope.selectedIndex];
      // if (entry.read_at == null) {
      //   var read_at = (new Date(Date.now())).toISOString();
      //   entry.read_at = read_at;
      //   Entry.markRead(entry.id, read_at);
      //   Feed.decrementCurrentFeedCount();
      // } else {
      //   entry.read_at = null;
      //   Entry.markUnread(entry.id);
      //   Feed.incrementCurrentFeedCount();
      // }
      // articles_scope.$apply();
    }

    $scope.removeArticleTag = function(event) {
      var tag = event.target.parentElement.innerText.trim();
      var article_id = $scope.articles[$scope.selectedIndex].id;
      var input_scope = angular.element($('#add_article_tag_' + article_id)).scope();
      var tag_idx = input_scope.article.article_tags.indexOf(tag);
      input_scope.article.article_tags.splice(tag_idx, 1);
      Entry.removeTag(article_id, tag);
    }

    function hideSelectedArticle() {
      var article_id = '#article_' + $scope.articles[$scope.selectedIndex].id;
      $(article_id).hide();
    }

    function markSelectedArticleRead() {
      var entry = $scope.articles[$scope.selectedIndex];
      var read_at = (new Date(Date.now())).toISOString();
      entry.read_at = read_at;
      Entry.markRead(entry.id, read_at);
    }

    function markSelectedArticleUnread() {
      var entry = $scope.articles[$scope.selectedIndex];
      entry.read_at = null;
      Entry.markUnread(entry.id);
    }    

    function scrollToEntry(entry_id) {
      var article_id = '#article_' + entry_id;
      var article_elm = angular.element($(article_id));
      angular.element($('#articles_panel')).scrollToElement(article_elm, 7, 0);

      console.log("entry_id: " + entry_id);
      console.log("Scrolling to: " + $(article_id + ' h2').text());
    }

    function setSelectedIndex(selected_article_id) {
      for (var i = 0; i < $scope.articles.length; i++) {
        if ($scope.articles[i].id === selected_article_id) {
          $scope.selectedIndex = i;
          return;
        }
      }
    }

    function showSelectedArticle() {
      var article_id = '#article_' + $scope.articles[$scope.selectedIndex].id;
      $(article_id).show();
    }
  }
]);
