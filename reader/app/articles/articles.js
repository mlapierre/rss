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
      if ($scope.selectedIndex !== $index) {
        logEvent('blur_article');
        $scope.selectedIndex = $index;
        logEvent('focus_article');

        var input_elm = angular.element($('#add_article_tag_' + $scope.articles[$index].id));
        Hotkeys.assignHotkeyEvents(input_elm);

        // If the selected article is near the end, fetch more
        var selected_article_id = $scope.articles[$scope.selectedIndex].id;
        fetchArticles(selected_article_id);
      }
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

    $scope.isRead = function(index) {
      if ($scope.articles[index].read_at === null || $scope.articles[index].read_at === undefined) {
        return false;
      }
      return true;
    }

    $scope.openArticleSource = function(index) {
      if ($scope.selectedIndex !== index) {
        logEvent('blur_article');
        $scope.selectedIndex = index;
        logEvent('focus_article');
      }
      logEvent('open_article_source');
    }

    $scope.selectNext = function() {
      if (!$scope.isRead($scope.selectedIndex)) {
        Feed.decrementCurrentFeedCount();
        markSelectedArticleRead();
        hideSelectedArticle();
      }

      if ($scope.selectedIndex !== $scope.$$childTail.$index) {
        if ($scope.isRead($scope.selectedIndex)) {
          logEvent('blur_article');
        }

        $scope.selectedIndex++;
        $scope.$apply();
        logEvent('focus_article');
      }
      var selected_article_id = $scope.articles[$scope.selectedIndex].id;
      scrollToEntry(selected_article_id);
      var input_elm = angular.element($('#add_article_tag_' + selected_article_id));
      Hotkeys.assignHotkeyEvents(input_elm);

      fetchArticles(selected_article_id);
    }

    $scope.selectPrev = function() {
      if ($scope.selectedIndex - 1 < 0) {
        $scope.selectedIndex = 0;
      } else {
        logEvent('blur_article');
        $scope.selectedIndex--;
        logEvent('focus_article');
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
      if ($scope.isRead($scope.selectedIndex)) {
        Feed.incrementCurrentFeedCount();
        markSelectedArticleUnread();
      } else {
        Feed.decrementCurrentFeedCount();
        markSelectedArticleRead();
      }
    }

    $scope.removeArticleTag = function(event) {
      var tag = event.target.parentElement.innerText.trim();
      var article_id = $scope.articles[$scope.selectedIndex].id;
      var input_scope = angular.element($('#add_article_tag_' + article_id)).scope();
      var tag_idx = input_scope.article.article_tags.indexOf(tag);
      input_scope.article.article_tags.splice(tag_idx, 1);
      Entry.removeTag(article_id, tag);
    }

    function fetchArticles(selected_article_id) {
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
                      });
      }
    }

    function logEvent(event) {
      console.log(event + ' ' + $scope.articles[$scope.selectedIndex].id);
      Articles.logEvent({
                          "event": event,
                          "article_index": $scope.selectedIndex,
                          "article_id": $scope.articles[$scope.selectedIndex].id
                        });
    }

    function hideSelectedArticle() {
      var article_id = '#article_' + $scope.articles[$scope.selectedIndex].id;
      $(article_id).hide();
      logEvent('blur_article');
    }

    function markSelectedArticleRead() {
      var entry = $scope.articles[$scope.selectedIndex];
      var read_at = (new Date(Date.now())).toISOString();
      entry.read_at = read_at;
      Entry.markRead(entry.id, read_at);
      logEvent('article_read');
    }

    function markSelectedArticleUnread() {
      var entry = $scope.articles[$scope.selectedIndex];
      entry.read_at = null;
      Entry.markUnread(entry.id);
      logEvent('article_unread');
    }

    function scrollToEntry(entry_id) {
      var article_id = '#article_' + entry_id;
      var article_elm = angular.element($(article_id));
      angular.element($('#articles_panel')).scrollToElement(article_elm, 7, 0);
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
