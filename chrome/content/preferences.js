if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};

AGBShortURLChrome.Preferences = function() {
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
         .getService(Components.interfaces.nsIPrefService)
         .getBranch("extensions.shortly.");
    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefs.addObserver("", this, false);
    this.callback = null;
}

AGBShortURLChrome.Preferences.prototype = {
  observe: function(subject, topic, data) {
    if (topic != "nsPref:changed")
        return;
    this.callback(data);
  },

  getStringValue: function(key) {
    return this.prefs.getCharPref(key);
  },

  setStringValue: function(key, value) {
    this.prefs.setCharPref(key, value);
  },

  getBooleanValue: function(key) {
    return this.prefs.getBoolPref(key);
  },

  setBooleanValue: function(key, value) {
    this.prefs.setBoolPref(key, value);
  },

  getIntegerValue: function(key) {
    return this.prefs.getIntPref(key);
  },

  setIntegerValue: function(key, value) {
    this.prefs.setIntPref(key, value);
  }
};


