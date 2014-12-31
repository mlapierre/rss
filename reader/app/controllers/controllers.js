angular.module('readerAppControllers', [])

.controller('feedsPanelCtrl', ['$scope', 'Feed', function($scope, Feed) {
  $scope.feeds = Feed.query();
  $scope.items = ['Item 1', 'Item 2', 'Item 3'];
}]);
