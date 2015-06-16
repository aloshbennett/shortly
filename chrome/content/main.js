if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};


AGBShortURLChrome.Shortly = {
  urlCache : new AGBShortURLChrome.Cache(),
  core : new AGBShortURLChrome.Core(),
  prefs : new AGBShortURLChrome.Preferences(),
  keys : new AGBShortURLChrome.KeyManager(),

  initialize : function() {
    this.prefs.callback = AGBShortURLChrome.Callbacks.preferenceChanged;
    this.keys.prefs = this.prefs;
  },

  gotShortURL : function(longURL, shortURL) {
    this.urlCache.addToCache(longURL, shortURL);
    if(this.prefs.getBooleanValue("clipboard.enable"))
        AGBShortURLChrome.GUI.copyClipboard(shortURL);
    AGBShortURLChrome.GUI.Notification.displayNotification(shortURL);
  },

  requestShortly : function(longURL) {
    let shortURL = this.urlCache.get(longURL);
    if(shortURL == null) {
        let key = this.keys.readKey();
        this.core.shortenURL(longURL, key,
          AGBShortURLChrome.Callbacks.gotShortURL,
          AGBShortURLChrome.Callbacks.retry);
        this.keys.refreshKey(false, null);
    } else {
        this.gotShortURL(longURL, shortURL);
    }
  },

  retry : function(longURL) {
    var self = this;
    this.keys.refreshKey(true, function() {
      var key = self.keys.readKey();
      self.core.shortenURL(longURL, key,
          AGBShortURLChrome.Callbacks.gotShortURL,
          null);
    });
  },

  preferenceChanged: function(preference) {
    if(preference == "accesskey.enable")
        AGBShortURLChrome.GUI.setKeyListener();
    if(preference == "addonbar.enable")
        AGBShortURLChrome.GUI.initializeGUI();
    if(preference == "urlbox.enable")
        AGBShortURLChrome.GUI.initializeGUI();
  },

  load: function() {
    AGBShortURLChrome.Shortly.initialize();
    AGBShortURLChrome.GUI.initializeGUI();
    AGBShortURLChrome.GUI.initializeListeners();
  }
};
