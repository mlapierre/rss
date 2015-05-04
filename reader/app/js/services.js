angular.module('readerAppServices', ['ngResource', 'appConfig'])

.factory('Feed', function($resource, settings) {
  return $resource('http://' + settings.apiAddr + ':' + settings.apiPort + '/feeds', {}, {
    query: {method:'GET', isArray:true}
  });
})

.factory('Entry', function($resource, settings) {
  return $resource('http://' + settings.apiAddr + ':' + settings.apiPort + '/feeds/entries/:feedId', {}, {
    query: {method:'GET', params:{feedId:'feeds'}, isArray:true}
  });
});  
