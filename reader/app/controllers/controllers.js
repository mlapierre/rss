angular.module('readerAppControllers', ['duScroll'])

.controller('feedsPanelController', function($scope, $location, Feed) {
  $scope.feeds = Feed.query();

  $scope.feed_url = '';
  $scope.new_feed = '';
  $scope.addSubscription = function() {
    var input_scope = angular.element($('#add_subscription')).scope();
    if (input_scope.add_feed_form.$valid) {
      console.log("Valid feed");
      Feed.save({link: input_scope.feed_url}, function(resp) {
             feed = JSON.parse(resp.feed);
             $location.path("#/feed/" + feed.id);
           });

      $scope.feeds = Feed.query();
      
      

      // $scope.new_feed = Feed.save({link: input_scope.feed_url}, function(resp) {
      //       feed = JSON.parse(resp.feed);
      //       console.log(feed.id);
      //       $scope.feeds.push(Feed.get({id: feed.id}));
      //     });
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
    toggleArticleRead(entries_scope, true);

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

  function scrollToEntry(entry_id) {
    var entries_scope = angular.element($('#entries_view')).scope();
    var article_id = '#article_' + entry_id;
    var article_elm = angular.element($(article_id));
    angular.element($('#entries_panel')).scrollToElement(article_elm, 7, 150);
  }

  function toggleArticleRead(entries_scope, always_mark_read) {
    always_mark_read = always_mark_read || false;
    var entry = entries_scope.entries[entries_scope.selectedIndex];
    if (always_mark_read || entry.read_at == null) {
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

