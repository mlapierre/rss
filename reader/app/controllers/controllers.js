angular.module('readerAppControllers', ['duScroll'])

.controller('feedsPanelCtrl', ['$scope', 'Feed', function($scope, Feed) {
  $scope.feeds = Feed.query();
  $scope.items = ['Item 1', 'Item 2', 'Item 3'];
}])

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


    // if (entries_scope.selectedIndex !== entries_scope.$$childTail.$index) {
    //   entries_scope.selectedIndex++;
    // } else {
    //   entries_scope.selectedIndex = getLastVisibleEntry(entries_scope);
    // }

    // setTimeout(function() {
      entries_scope.$apply();
    // }, 250);
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
      console.log('#article_' + entry.id +' read at:', entry.read_at);
    } else {
      entry.read_at = null;
      console.log('#article_' + entry.id +' not read');
    }
    Entry.update({id: entry.id}, entry);

    //$('#article_' + entry.id).css('opacity', 0);

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
}]);
