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

    currentFeedCount: function() {
      var feed = this.getCurrentFeed();
      return feed.unread_count;
    },

    decrementCurrentFeedCount: function() {
      var feed = this.getCurrentFeed();
      feed.unread_count = Math.max(0, feed.unread_count - 1);
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

.factory('Articles', function($resource, $rootScope, $timeout, settings, Feed) {
  var resource = $resource(settings.apiBaseURL + 'entries/feed/:id');
  var db = new PouchDB(settings.couchdbBaseURL + 'article_events');

  function getRandString() {
    return (Math.random()+1).toString(36).slice(2,10);
  }

  function logEvent(event) {
    event["_id"] = (new Date(Date.now())).toISOString() + '-' + getRandString();
    db.put(event).then(function (response) {

    }).catch(function (err) {
      console.log(err);
    });
  }

  return {
    getFromFeed: function (feed_id) {
      var articles = resource.query({id: feed_id, isArray: true}, function() {
        Feed.setCurrentFeed(feed_id);
        $rootScope.$broadcast('feedSelected');
        logEvent({
                  "event": "feed_selected",
                  "feed_id": feed_id
                 });
      });
      return articles;
    },

    fetch: function(scope, num) {
      var articles = scope.articles;
      var sort_by = "published";
      var fetch_after = articles[articles.length - 1].published;
      if (fetch_after === null) {
        sort_by = "id";
        fetch_after = articles[articles.length - 1].id;
      }
      console.log("Fetching after: " + fetch_after);

      resource.query({
                        id: scope.feedId,
                        isArray: true,
                        n: num,
                        sort_by: sort_by,
                        after: fetch_after
                      }, function(fetched_articles) {
                        postQuery(fetched_articles);
                      } );
      function postQuery(fetched_articles) {
        $timeout(function() {
          console.log("fetched " + fetched_articles.length + " more articles");
          Array.prototype.push.apply(articles, fetched_articles.slice(0, fetched_articles.length));

          if (articles.length > 15) {
            articles.splice(0, articles.length - 15);
          }
          scope.fetching = false;
        }, 0);
      }
    },

    logEvent: function(event) {
      logEvent(event);
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

.factory('Hotkeys', function($document) {
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
      $document.off('keypress'); // unregister so there's only one instance of the event if this
                                 // function is called more than once
      $document.on('keypress', keypressHandler);
    });
  }

  function handleNextArticle() {
    var articles_scope = angular.element($('#articles_view')).scope();
    articles_scope.selectNext();
  }

  function handlePrevArticle() {
    var articles_scope = angular.element($('#articles_view')).scope();
    articles_scope.selectPrev();
  }

  function handleToggleArticleRead() {
    var articles_scope = angular.element($('#articles_view')).scope();
    articles_scope.toggleRead();
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
