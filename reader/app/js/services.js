'use strict';

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
  var resource = $resource(settings.apiBaseURL + 'entries/feed/:id');
  var _entries = [];
  var _feed_id;

  return {
    getEntries: function() {
      return _entries;
    },

    getFromFeed: function (feed_id) {
      _feed_id = feed_id;
      _entries = resource.query({id: _feed_id, isArray: true});
      return _entries;
    },

    fetchAndTrimIfNeeded: function(index) {
      if (index > (_entries.length - 6)) {
        var sort_by = "published";
        var fetch_after = _entries[_entries.length - 1].published;
        if (fetch_after === null) {
          sort_by = "id";
          fetch_after = _entries[_entries.length - 1].id;
        }
        this.fetchMore(5, fetch_after, sort_by);
        this.trim();
        _entries = this.getEntries();
      }
    },

    fetchMore: function(num, fetch_after, sort_by) {
      resource.query({
                        id: _feed_id, 
                        isArray: true,
                        n: num,
                        sort_by: sort_by,
                        after: encodeURIComponent(fetch_after)
                      }, function(entries) {
                           Array.prototype.push.apply(_entries, entries.slice(0, entries.length));
                           console.log("fetched " + entries.length + " more articles");
                         }
      );
    },

    trim: function() {
      if (_entries.length > 15) {
        _entries.splice(0, _entries.length - 15);
      }
    }
  };
})

.factory('Entry', function($resource, settings) {
  var resource = $resource(settings.apiBaseURL + 'entries/read/:entry_id', 
    { entry_id: '@entry_id' }
  );

  return {
    markRead: function(_entry_id, read_at) {
      resource.save({entry_id: _entry_id, 'read_at': read_at});
    },

    markUnread: function(_entry_id) {
      resource.save({entry_id: _entry_id, 'read_at': null});
    }
  };
})  

.factory('Tag', function($resource, settings) {
  return $resource(settings.apiBaseURL + 'tags/:id');
});

