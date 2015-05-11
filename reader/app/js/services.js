angular.module('readerAppServices', ['ngResource', 'appConfig'])

.factory('Feed', function($resource, settings) {
  return $resource('http://' + settings.apiAddr + ':' + settings.apiPort + '/feeds/:id');
})

.factory('Entries', function($resource, settings) {
  return $resource('http://' + settings.apiAddr + ':' + settings.apiPort + '/entries/feed/:id');
})

.factory('Entry', function($resource, settings) {
  return $resource('http://' + settings.apiAddr + ':' + settings.apiPort + '/entries/:id', {}, {
    update: {method:'PUT'}
  });
});  
