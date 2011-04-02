if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};


AGBShortURLChrome.GUI = {

  initialize : function() {
    this.setKeyListener();
  },

  setKeyListener : function() {
    if(AGBShortURLChrome.Shortly.prefs.getBooleanValue("accesskey.enable")) {
        window.addEventListener('keydown', AGBShortURLChrome.Callbacks.keyEvent, false);
    }
    else
        window.removeEventListener('keydown', AGBShortURLChrome.Callbacks.keyEvent, false);
  },

  keyEvent : function(event) {
    var keyCombo = AGBShortURLChrome.Shortly.prefs.getStringValue("accesskey.combination");
    if(AGBShortURLChrome.KeyUtils.compareKeyevent(event, keyCombo))
        this.shortenPageURL();
  },

  shortenPageURL: function() {
    AGBShortURLChrome.Shortly.requestShortly(window.content.location.href);
  },

  copyClipboard : function(data) {
    const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].
        getService(Components.interfaces.nsIClipboardHelper);
    gClipboardHelper.copyString(data);
  }

};

AGBShortURLChrome.GUI.initialize();
