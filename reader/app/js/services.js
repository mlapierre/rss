'use strict';

angular.module('readerAppServices', ['ngResource', 'appConfig'])

.factory('Feed', function($resource, settings) {
  var resource = $resource(settings.apiBaseURL + 'feeds/:id', {}, {
    update: {method:'PATCH', params: {id: 'tags'}}
  });
  var _feeds;
  var current_feed_id;

  return {
    addFeed: function(link) {
      resource.save({'link': link}, function(resp) {
        feed = JSON.parse(resp.feed);
        $location.path("#/feed/" + feed.id);
      });
    },

    decrementCurrentFeedCount: function() {
      var feed = this.getCurrentFeed();
      feed.unread_count -= 1;
    },

    getFeeds: function() {
      return _feeds || resource.query(function(feeds) {
        _feeds = feeds;
      });
    },

    getTagsAndFeeds: function() {
      return resource.query({id: 'tags'}, function(tags) {
        _feeds = [];
        for (var i = 0; i < tags.length; i++) {
          if (tags[i].order === undefined) {
            tags[i].order = i;
          }
          for (var j = 0; j < tags[i].feeds.length; j++) {
            if (tags[i].feeds[j].order === undefined) {
              tags[i].feeds[j].order = j;
            }
            _feeds.push(tags[i].feeds[j]);
          }
        }
      });
    },

    incrementCurrentFeedCount: function() {
      var feed = this.getCurrentFeed();
      feed.unread_count += 1;
    },

    getCurrentFeed: function() {
      for (var i=0; i<_feeds.length; i++) {
        if (_feeds[i].id == current_feed_id) {
          return _feeds[i];
        }
      }
    },

    setCurrentFeed: function(feed_id) {
      current_feed_id = feed_id;
    },

    updateTags: function(tags) {
      resource.update({'tags': tags});
    }
  };
})

.factory('Articles', function($resource, $rootScope, settings, Feed) {
  var resource = $resource(settings.apiBaseURL + 'entries/feed/:id');
  var _entries = [];
  var _feed_id;

  return {
    getEntries: function() {
      return _entries;
    },

    getFromFeed: function (feed_id) {
      _feed_id = feed_id;
      _entries = resource.query({id: _feed_id, isArray: true}, function() {
        Feed.setCurrentFeed(_feed_id);
        $rootScope.$broadcast('feedSelected');
      });
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
  var read_resource = $resource(settings.apiBaseURL + 'entries/read/:entry_id', 
    { entry_id: '@entry_id' }
  );

  var tag_resource = $resource(settings.apiBaseURL + 'entries/:entry_id/tag/:name', 
    { entry_id: '@entry_id', name: '@name' }
  );

  return {
    addTag: function(_entry_id, tag_name) {
      tag_resource.save({entry_id: _entry_id, name: tag_name});
    },

    markRead: function(_entry_id, read_at) {
      read_resource.save({entry_id: _entry_id, 'read_at': read_at});
    },

    markUnread: function(_entry_id) {
      read_resource.save({entry_id: _entry_id, 'read_at': null});
    },

    removeTag: function(_entry_id, tag_name) {
      tag_resource.remove({entry_id: _entry_id, name: tag_name});
    }
  };
})  

.factory('Hotkeys', function($document, Entry, Articles, Feed) {
  var keyHanders = {
    'n': handleNextArticle,
    'p': handlePrevArticle,
    'm': handleToggleArticleRead
  };

  function assignHotkeyEvents(elm) {
    elm.on('focus', function() {
      $document.off('keypress');
    });
    elm.on('blur', function() {
      $document.on('keypress', keypressHandler);
    });      
  }

  function handleNextArticle() {
    var articles_scope = angular.element($('#articles_view')).scope();

    if (!isRead(articles_scope.articles[articles_scope.selectedIndex])) {
      Feed.decrementCurrentFeedCount();
      markSelectedArticleRead(articles_scope);
    }

    if (articles_scope.selectedIndex !== articles_scope.$$childTail.$index) {
      articles_scope.selectedIndex++;
      articles_scope.$apply();
    }

    Articles.fetchAndTrimIfNeeded(articles_scope.selectedIndex);
    scrollToEntry(articles_scope.articles[articles_scope.selectedIndex].id);

    var input_elm = angular.element($('#add_article_tag_' + articles_scope.articles[articles_scope.selectedIndex].id));
    assignHotkeyEvents(input_elm);
  }

  function handlePrevArticle() {
    var articles_scope = angular.element($('#articles_view')).scope();
    if (articles_scope.selectedIndex - 1 < 0) {
      articles_scope.selectedIndex = 0;
    } else {
      articles_scope.selectedIndex--;
    }
    articles_scope.$apply();
    scrollToEntry(articles_scope.articles[articles_scope.selectedIndex].id);

    if (isRead(articles_scope.articles[articles_scope.selectedIndex])) {
      Feed.incrementCurrentFeedCount();
      markSelectedArticleUnread(articles_scope);
    }

    var input_elm = angular.element($('#add_article_tag_' + articles_scope.articles[articles_scope.selectedIndex].id));
    assignHotkeyEvents(input_elm);
  }

  function handleToggleArticleRead() {
    var articles_scope = angular.element($('#articles_view')).scope();
    var entry = articles_scope.articles[articles_scope.selectedIndex];
    if (entry.read_at == null) {
      var read_at = (new Date(Date.now())).toISOString();
      entry.read_at = read_at;
      Entry.markRead(entry.id, read_at);
      Feed.decrementCurrentFeedCount();
    } else {
      entry.read_at = null;
      Entry.markUnread(entry.id);
      Feed.incrementCurrentFeedCount();
    }
    articles_scope.$apply();
  }  

  function isRead(entry) {
    if (entry.read_at !== null && entry.read_at !== undefined) {
      return true;
    }
    return false;
  }

  function markSelectedArticleRead(articles_scope) {
    var entry = articles_scope.articles[articles_scope.selectedIndex];
    var read_at = (new Date(Date.now())).toISOString();
    entry.read_at = read_at;
    Entry.markRead(entry.id, read_at);
  }

  function markSelectedArticleUnread(articles_scope) {
    var entry = articles_scope.articles[articles_scope.selectedIndex];
    entry.read_at = null;
    Entry.markUnread(entry.id);
  }

  function processKeypress(key) {
    if (typeof keyHanders[key] === 'function') {
      return keyHanders[key](key);
    } 
  }

  function scrollToEntry(entry_id) {
    var articles_scope = angular.element($('#articles_view')).scope();
    var article_id = '#article_' + entry_id;
    var article_elm = angular.element($(article_id));
    angular.element($('#articles_panel')).scrollToElement(article_elm, 7, 150);
  }

  function getChar(event) {
    if (event.which === null) {
      return String.fromCharCode(event.keyCode) // IE
    } else if (event.which !== 0 && event.charCode !== 0) {
      return String.fromCharCode(event.which)   // the rest
    } else {
      return null 
    }
  }  

  function keypressHandler(keyEvent) {
    processKeypress(getChar(keyEvent));
  }  

  return {
    init: function() {
      $document.on('keypress', keypressHandler);
    },

    assignHotkeyEvents: function(elm) {
      return assignHotkeyEvents(elm);
    }
  }
})

.factory('Tag', function($resource, settings) {
  return $resource(settings.apiBaseURL + 'tags/:id');
});

