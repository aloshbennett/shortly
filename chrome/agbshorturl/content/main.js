if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};

AGBShortURLChrome.Cache = {
  map : new Array(),

  addToCache : function(longURL, shortURL) {
    this.map.push({longURL: longURL, shortURL: shortURL});
  },

  get : function(longURL) {
    for(i=0; i<this.map.length; i++) {
        if(this.map[i].longURL == longURL)
            return this.map[i].shortURL;
    }
  },

  removeFromCache : function(longURL) {
    for(i=0; i<this.map.length; i++) {
        if(this.map[i].longURL == longURL) {
            this.map.splice(i, 1);
            break;
        }
    }
  }
};


AGBShortURLChrome.Shortly = {
  urlCache : AGBShortURLChrome.Cache,
  serviceListener : AGBShortURLChrome.ServiceListener,

  initialize : function() {
    AGBShortURLChrome.Shortly.prefs = Components.classes["@mozilla.org/preferences-service;1"]
         .getService(Components.interfaces.nsIPrefService)
         .getBranch("shortly.");
    if(AGBShortURLChrome.Shortly.prefs.getBoolPref("accesskey.enable"))
        window.addEventListener('keydown', AGBShortURLChrome.Shortly.keyEvent, false);
  },

  loadPrefs : function() {
    if(AGBShortURLChrome.Shortly.prefs.getBoolPref("accesskey.enable"))
        window.addEventListener('keydown', AGBShortURLChrome.Shortly.keyEvent, false);
    else
        window.removeEventListener('keydown', AGBShortURLChrome.Shortly.keyEvent, false);
  },

  requestShortURL : function(aEvent) {
    let longURL = window.content.location.href;
    let shortURL = AGBShortURLChrome.Shortly.urlCache.get(longURL);
    if(shortURL == null)
        AGBShortURLChrome.Shortly.shortenURL(longURL);
    else {
        AGBShortURLChrome.Shortly.displayShortURL(shortURL);
        AGBShortURLChrome.Shortly.copyClipboard(shortURL);
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
    //channel.notificationCallbacks = listener;
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
    AGBShortURLChrome.Shortly.displayShortURL(AGBShortURLChrome.Shortly.urlCache.get(longURL));
  },

  keyEvent : function(event) {
    var keyCombo = AGBShortURLChrome.Shortly.prefs.getCharPref("accesskey.combination");
    if(KeyUtils.compareKeyevent(event, keyCombo))
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

AGBShortURLChrome.Shortly.initialize();

window.gBrowser.tabContainer.addEventListener('TabSelect', AGBShortURLChrome.Shortly.resetDisplay, false, true);
window.gBrowser.addEventListener('pageshow', AGBShortURLChrome.Shortly.resetDisplay, false);

