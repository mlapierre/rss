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
      return (sourcetype === destType); // only accept the same type
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
  }

  $scope.addFeedTag = function() {
    var input_scope = angular.element($('#add_feed_tag')).scope();
    if (input_scope.add_feed_form.$valid) {
      console.log("Valid tag: " + $scope.feed_tag);
      Tag.save({name: input_scope.feed_tag});
    } 
  }
})

.controller('mainCtrl', ['$scope', '$document', 'Entry', function($scope, $document, Entry) {
  var keyHanders = {
    'n': handleNextArticle,
    'p': handlePrevArticle,
    'm': handleToggleArticleRead
  };
  
  function handleNextArticle() {
    var entries_scope = angular.element($('#entries_view')).scope();
    markSelectedArticleRead(entries_scope);

    if (entries_scope.selectedIndex !== entries_scope.$$childTail.$index) {
      entries_scope.selectedIndex++;
      entries_scope.$apply();
    }
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
    markSelectedArticleUnread(entries_scope);
  }

  function handleToggleArticleRead() {
    var entries_scope = angular.element($('#entries_view')).scope();
    toggleArticleRead(entries_scope);
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

  function markSelectedArticleRead(entries_scope) {
    var entry = entries_scope.entries[entries_scope.selectedIndex];
    var now = new Date(Date.now());
    entry.read_at = now.toISOString();
    Entry.update({id: entry.id}, entry);
  }

  function markSelectedArticleUnread(entries_scope) {
    var entry = entries_scope.entries[entries_scope.selectedIndex];
    entry.read_at = null;
    Entry.update({id: entry.id}, entry);
  }

  function scrollToEntry(entry_id) {
    var entries_scope = angular.element($('#entries_view')).scope();
    var article_id = '#article_' + entry_id;
    var article_elm = angular.element($(article_id));
    angular.element($('#entries_panel')).scrollToElement(article_elm, 7, 150);
  }

  function toggleArticleRead(entries_scope) {
    var entry = entries_scope.entries[entries_scope.selectedIndex];
    if (entry.read_at == null) {
      var now = new Date(Date.now());
      entry.read_at = now.toISOString();
    } else {
      entry.read_at = null;
    }
    Entry.update({id: entry.id}, entry);
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
      return null // special key
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
}]);

