if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};


AGBShortURLChrome.Callbacks = {
    gotShortURL : function(longURL, shortURL) {
        AGBShortURLChrome.Shortly.gotShortURL(longURL, shortURL);
    },

    preferenceChanged: function(preference) {
        AGBShortURLChrome.Shortly.preferenceChanged(preference);
    },

    keyEvent : function(event) {
        AGBShortURLChrome.GUI.keyEvent(event);
    },

    clickFilter: function(event) {
        AGBShortURLChrome.GUI.clickFilter(event);
    }

};
