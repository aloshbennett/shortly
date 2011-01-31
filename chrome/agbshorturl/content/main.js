if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};


AGBShortURLChrome.Shortly = {
  urlCache : AGBShortURLChrome.Cache,
  prefs : null,
  loadComplete : false,

  initialize : function() {
    AGBShortURLChrome.Shortly.prefs = Components.classes["@mozilla.org/preferences-service;1"]
         .getService(Components.interfaces.nsIPrefService)
         .getBranch("shortly.");
    AGBShortURLChrome.Shortly.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    AGBShortURLChrome.Shortly.prefs.addObserver("", this, false);
    AGBShortURLChrome.Shortly.setKeyListener();
    window.gBrowser.tabContainer.addEventListener('TabSelect', AGBShortURLChrome.Shortly.resetDisplay, false, true);
    window.gBrowser.addEventListener('pageshow', AGBShortURLChrome.Shortly.resetDisplay, false);
    AGBShortURLChrome.Shortly.loadComplete = true;
  },

  observe: function(subject, topic, data) {
    if (topic != "nsPref:changed")
        return;
    if(data == "accesskey.enable") 
        AGBShortURLChrome.Shortly.setKeyListener();
  },

  setKeyListener : function() {
    if(AGBShortURLChrome.Shortly.prefs.getBoolPref("accesskey.enable"))
        window.addEventListener('keydown', AGBShortURLChrome.Shortly.keyEvent, false);
    else
        window.removeEventListener('keydown', AGBShortURLChrome.Shortly.keyEvent, false);
  },

  requestShortURL : function(aEvent) {
    if(!AGBShortURLChrome.Shortly.loadComplete)
        AGBShortURLChrome.Shortly.initialize();
    let longURL = window.content.location.href;
    let shortURL = AGBShortURLChrome.Shortly.urlCache.get(longURL);
    if(shortURL == null)
        AGBShortURLChrome.Shortly.shortenURL(longURL);
    else {
        AGBShortURLChrome.Shortly.urlCache.toggleDisplay(longURL);
        if(AGBShortURLChrome.Shortly.urlCache.isDisplayed(longURL)) {
            AGBShortURLChrome.Shortly.displayShortURL(shortURL);
            AGBShortURLChrome.Shortly.copyClipboard(shortURL);
        } else
            AGBShortURLChrome.Shortly.displayShortURL(null);
    }
  },

  shortenURL : function(url) {
    url = encodeURIComponent(url);
    var ioService=Components.classes["@mozilla.org/network/io-service;1"]
        .getService(Components.interfaces.nsIIOService);
    var scriptableStream = Components
        .classes["@mozilla.org/scriptableinputstream;1"]
        .getService(Components.interfaces.nsIScriptableInputStream);
    var bitlyURL = 'http://api.bit.ly/v3/shorten?login=oneclickshorten&apiKey=R_66e801e8a9a088ded55f075f78eb7d90&longUrl='+url+'&format=json';
    var channel=ioService.newChannel(bitlyURL,null,null);

    function ServiceListener(callback) {
        this.callback = callback;
    }

    ServiceListener.prototype = {
        serviceData : "",

        onStartRequest: function(request, ctx) {
        },

        onDataAvailable : function(request, context, inputStream, offset, count) {
            scriptableStream.init(inputStream);
            this.serviceData += scriptableStream.read(count);
        },

        onStopRequest: function(request, ctx, status) {
            this.callback(JSON.parse(this.serviceData));
        },

    };

    var listener = new ServiceListener(AGBShortURLChrome.Shortly.callbackHandler);
    channel.asyncOpen(listener, null);

  },


  callbackHandler : function(result) {
    let shortURL = result.data.url;
    let longURL = result.data.long_url;
    AGBShortURLChrome.Shortly.urlCache.addToCache(longURL, shortURL);
    AGBShortURLChrome.Shortly.displayShortURL(shortURL);
    AGBShortURLChrome.Shortly.copyClipboard(shortURL);
  },

  resetDisplay : function(event) {
    let longURL = window.content.location.href;
    let shortURL = AGBShortURLChrome.Shortly.urlCache.get(longURL);
    if(shortURL != null && AGBShortURLChrome.Shortly.urlCache.isDisplayed(longURL))
        AGBShortURLChrome.Shortly.displayShortURL(shortURL);
    else
        AGBShortURLChrome.Shortly.displayShortURL(null);
  },

  keyEvent : function(event) {
    var keyCombo = AGBShortURLChrome.Shortly.prefs.getCharPref("accesskey.combination");
    if(AGBShortURLChrome.KeyUtils.compareKeyevent(event, keyCombo))
        AGBShortURLChrome.Shortly.requestShortURL();
  },

  displayShortURL : function(shortURL) {
    let shortURLBar = document.getElementById("agbshorturl-statusbar-urltext");
    if(shortURL == null) {
        shortURLBar.hidden=true;
        shortURLBar.value = "";
    }
    else {   
        shortURLBar.hidden=false;
        shortURLBar.value = shortURL;
        shortURLBar.size = shortURL.length-3;
    }
  },

  copyClipboard : function(shortURL) {
    if(AGBShortURLChrome.Shortly.prefs.getBoolPref("clipboard.enable")) {
        const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].
            getService(Components.interfaces.nsIClipboardHelper);
        gClipboardHelper.copyString(shortURL);
    }
  }

};
//window.addEventListener('load', AGBShortURLChrome.Shortly.initialize, false);
AGBShortURLChrome.Shortly.initialize();

