angular.module('readerAppControllers', [])

.controller('feedsPanelCtrl', ['$scope', 'Feed', function($scope, Feed) {
  $scope.feeds = Feed.query();
  $scope.items = ['Item 1', 'Item 2', 'Item 3'];
}])

.controller('mainCtrl', function ($scope, $document) {
  var keyHanders = {
    'n': handleNextArticle,
    'p': handlePrevArticle,
    'm': handleToggleArticleRead
  };
  
  function handleNextArticle() {
    var entries_scope = angular.element($('#entries_view')).scope();
    
    setTimeout(function(entry) {
      toggleArticleRead(entry);
    }(entries_scope.entries[entries_scope.selectedIndex]), 100);

    if (entries_scope.selectedIndex !== entries_scope.$$childTail.$index) {
      entries_scope.selectedIndex++;
      entries_scope.$apply();
    }
  }

  function handlePrevArticle() {
    var entries_scope = angular.element($('#entries_view')).scope();
    if (entries_scope.selectedIndex - 1 < 0) {
      entries_scope.selectedIndex = 0;
    } else {
      entries_scope.selectedIndex--;
    }
    entries_scope.$apply();
  }

  function handleToggleArticleRead() {
    var entries_scope = angular.element($('#entries_view')).scope();
    var now = new Date(Date.now());
    entries_scope.entries[entries_scope.selectedIndex].read_at = now.toISOString();
    console.log('#article_' + entries_scope.entries[entries_scope.selectedIndex].id + ' read at:', entries_scope.entries[entries_scope.selectedIndex].read_at);

    $('#article_' + entries_scope.entries[entries_scope.selectedIndex].id).css('opacity', 0);

    if (entries_scope.selectedIndex !== entries_scope.$$childTail.$index) {
      entries_scope.selectedIndex++;
    } else {
      entries_scope.selectedIndex = getLastVisibleEntry(entries_scope);
    }

    setTimeout(function() {
      entries_scope.$apply();
    }, 250);
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

  function toggleArticleRead(entry) {
    var entries_scope = angular.element($('#entries_view')).scope();
    var now = new Date(Date.now());
    entry.read_at = now.toISOString();
    console.log('#article_' + entry.id +' read at:', entry.read_at);

    $('#article_' + entry.id).css('opacity', 0);

    //setTimeout(entries_scope.$apply, 200);
  }

  function processKeypress(key) {
    if (typeof keyHanders[key] === 'function') {
      return keyHanders[key](key);
    } else {
      console.log('No hotkey for key: ', key);
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

  $document.on('keypress', keypressHandler);
});
