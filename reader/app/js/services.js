angular.module('readerAppServices', ['ngResource', 'appConfig'])

.factory('Feed', function($resource, settings) {
  return $resource('http://' + settings.apiAddr + ':' + settings.apiPort + '/feeds', {}, {
    query: {method:'GET', isArray:true}
  });
})

.factory('Entries', function($resource, settings) {
  return $resource('http://' + settings.apiAddr + ':' + settings.apiPort + '/entries/feed/:id', {}, {
    query: {method:'GET', isArray:true}
  })
})

.factory('Entry', function($resource, settings) {
  return $resource('http://' + settings.apiAddr + ':' + settings.apiPort + '/entries/:id', {}, {
    update: {method:'PUT'}
  });
});  
