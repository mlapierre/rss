angular.module('readerAppControllers', [])

.controller('feedsPanelCtrl', ['$scope', 'Feed', function($scope, Feed) {
  $scope.feeds = Feed.query();
  $scope.items = ['Item 1', 'Item 2', 'Item 3'];
}])

.controller('mainCtrl', function ($scope, $document) {
  var keyHanders = {
    'n': handleNextArticle,
    'p': handlePrevArticle
  };

  function handleNextArticle() {
    var scope = angular.element($('#entries_view')).scope();
    if (scope.selectedIndex !== scope.$$childTail.$index) {
      scope.selectedIndex++;
      scope.$apply();
    }
  }

  function handlePrevArticle() {
    var scope = angular.element($('#entries_view')).scope();
    if (scope.selectedIndex - 1 < 0) {
      scope.selectedIndex = 0;
    } else {
      scope.selectedIndex--;
    }
    scope.$apply();
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
    console.log('keypress', keyEvent);
    processKeypress(getChar(keyEvent));
  }

  $document.on('keypress', keypressHandler);
});
