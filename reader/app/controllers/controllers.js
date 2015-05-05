angular.module('readerAppControllers', [])

.controller('feedsPanelCtrl', ['$scope', 'Feed', function($scope, Feed) {
  $scope.feeds = Feed.query();
  $scope.items = ['Item 1', 'Item 2', 'Item 3'];
}])

.controller('mainCtrl', function ($scope, $document) {
  function keypressHandler(keyEvent) {
    console.log('keypress', keyEvent);

    //$scope.$apply(); // remove this line if not need
  }

  $document.on('keypress', keypressHandler);
});
