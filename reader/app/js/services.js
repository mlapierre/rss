angular.module('readerAppServices', ['ngResource', 'appConfig'])

.factory('Feed', function($resource, settings) {
  var resource = $resource(settings.apiBaseURL + 'feeds/:id', {}, {
    update: {method:'PATCH', params: {id: 'tags'}}
  });

  return {
    getFeeds: function() {
      return resource.query();
    },

    getTagsAndFeeds: function() {
      return resource.query({id: 'tags'}, function(tags) {
        for (var i = 0; i < tags.length; i++) {
          if (tags[i].order === undefined) {
            tags[i].order = i;
          }
          for (var j = 0; j < tags[i].feeds.length; j++) {
            if (tags[i].feeds[j].order === undefined) {
              tags[i].feeds[j].order = j;
            }
          }
        }
      });
    },

    updateTags: function(tags) {
      resource.update({'tags': tags});
    },

    addFeed: function(link) {
      resource.save({'link': link}, function(resp) {
        feed = JSON.parse(resp.feed);
        $location.path("#/feed/" + feed.id);
      });
    }

  };
})

.factory('Entries', function($resource, settings) {
  return $resource(settings.apiBaseURL + 'entries/feed/:id');
})

.factory('Entry', function($resource, settings) {
  return $resource(settings.apiBaseURL + 'entries/:id', {}, {
    update: {method:'PUT'}
  });
})  

.factory('Tag', function($resource, settings) {
  return $resource(settings.apiBaseURL + 'tags/:id');
});

