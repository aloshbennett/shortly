if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};


AGBShortURLChrome.Shortly = {
  urlCache : new AGBShortURLChrome.Cache(),
  core : new AGBShortURLChrome.Core(),
  prefs : new AGBShortURLChrome.Preferences(),
  keys : new AGBShortURLChrome.KeyManager(),

  initialize : function() {
    this.core.callback = AGBShortURLChrome.Callbacks.gotShortURL;
    this.prefs.callback = AGBShortURLChrome.Callbacks.preferenceChanged;
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
        this.core.shortenURL(longURL, key);
        this.keys.setNewKey();
    } else {
        this.gotShortURL(longURL, shortURL);
    }
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
