angular.module('readerAppControllers', ['duScroll'])

.controller('feedsPanelController', function($scope, $location, Feed, Tag) {
  $scope.feed_url = '';
  $scope.feed_tag = '';
  $scope.tags = Tag.query();
  $scope.feeds = Feed.getTagsAndFeeds();

  $scope.treeCallback = {
    accept: function(sourceNode, destNodes, destIndex) {
      var sourcetype = sourceNode.$parent.$element.attr('data-type');
      var destType = destNodes.$element.attr('data-type');
      return (sourcetype === destType); 
    },    
    dropped: function(event) {
      $scope.saveTags();
    }
  };

  $scope.saveTags = function() {
    var tags = $scope.feeds;
    for (var i = 0; i < tags.length; i++) {
      tags[i].order = i;
      for (var j = 0; j < tags[i].feeds.length; j++) {
        tags[i].feeds[j].order = j;
      }
    }
    Feed.updateTags(tags);
  };

  $scope.addSubscription = function() {
    var input_scope = angular.element($('#add_subscription')).scope();
    if (input_scope.add_feed_form.$valid) {
      console.log("Valid feed");
      Feed.addFeed(input_scope.feed_url);
      $scope.feeds = Feed.getFeeds();
    } 
  };

  $scope.addFeedTag = function() {
    var input_scope = angular.element($('#add_feed_tag')).scope();
    if (input_scope.add_feed_form.$valid) {
      console.log("Valid tag: " + $scope.feed_tag);
      Tag.save({name: input_scope.feed_tag});
    } 
  };
})

.controller('mainCtrl', ['$scope', '$document', 'Entry', 'Articles', 'Feed',
  function($scope, $document, Entry, Articles, Feed) {
    var keyHanders = {
      'n': handleNextArticle,
      'p': handlePrevArticle,
      'm': handleToggleArticleRead
    };
    
    function handleNextArticle() {
      var entries_scope = angular.element($('#entries_view')).scope();

      if (!isRead(entries_scope.entries[entries_scope.selectedIndex])) {
        Feed.decrementCurrentFeedCount();
        markSelectedArticleRead(entries_scope);
      }

      if (entries_scope.selectedIndex !== entries_scope.$$childTail.$index) {
        entries_scope.selectedIndex++;
        entries_scope.$apply();
      }
      Articles.fetchAndTrimIfNeeded(entries_scope.selectedIndex);
      scrollToEntry(entries_scope.entries[entries_scope.selectedIndex].id);
    }

    function handlePrevArticle() {
      var entries_scope = angular.element($('#entries_view')).scope();
      if (entries_scope.selectedIndex - 1 < 0) {
        entries_scope.selectedIndex = 0;
      } else {
        entries_scope.selectedIndex--;
      }
      entries_scope.$apply();
      scrollToEntry(entries_scope.entries[entries_scope.selectedIndex].id);

      if (isRead(entries_scope.entries[entries_scope.selectedIndex])) {
        Feed.incrementCurrentFeedCount();
        markSelectedArticleUnread(entries_scope);
      }
    }

    function handleToggleArticleRead() {
      var entries_scope = angular.element($('#entries_view')).scope();
      var entry = entries_scope.entries[entries_scope.selectedIndex];
      if (entry.read_at == null) {
        var read_at = (new Date(Date.now())).toISOString();
        entry.read_at = read_at;
        Entry.markRead(entry.id, read_at);
        Feed.decrementCurrentFeedCount();
      } else {
        entry.read_at = null;
        Entry.markUnread(entry.id);
        Feed.incrementCurrentFeedCount();
      }
      entries_scope.$apply();
    }

    function getLastVisibleEntry(scope) {
      var last = scope.$$childHead.$index;
      scope.entries.forEach(function(v, i) {
        if ($('#article_' + v.id).is(':visible')) {
          last = i;
        }
      });
      return last;
    }

    function isRead(entry) {
      if (entry.read_at !== null && entry.read_at !== undefined) {
        return true;
      }
      return false;
    }

    function markSelectedArticleRead(entries_scope) {
      var entry = entries_scope.entries[entries_scope.selectedIndex];
      var read_at = (new Date(Date.now())).toISOString();
      entry.read_at = read_at;
      Entry.markRead(entry.id, read_at);
    }

    function markSelectedArticleUnread(entries_scope) {
      var entry = entries_scope.entries[entries_scope.selectedIndex];
      entry.read_at = null;
      Entry.markUnread(entry.id);
    }

    function scrollToEntry(entry_id) {
      var entries_scope = angular.element($('#entries_view')).scope();
      var article_id = '#article_' + entry_id;
      var article_elm = angular.element($(article_id));
      angular.element($('#entries_panel')).scrollToElement(article_elm, 7, 150);
    }

    function processKeypress(key) {
      if (typeof keyHanders[key] === 'function') {
        return keyHanders[key](key);
      } 
    }

    function getChar(event) {
      if (event.which === null) {
        return String.fromCharCode(event.keyCode) // IE
      } else if (event.which !== 0 && event.charCode !== 0) {
        return String.fromCharCode(event.which)   // the rest
      } else {
        return null 
      }
    }

    function keypressHandler(keyEvent) {
      processKeypress(getChar(keyEvent));
    }

    var add_feed_input = angular.element($('#add_subscription'));
    add_feed_input.on('focus', function() {
      $document.off('keypress');
    });
    add_feed_input.on('blur', function() {
      $document.on('keypress', keypressHandler);
    });

    $document.on('keypress', keypressHandler);
  }
]);

