if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};

AGBShortURLChrome.Cache = {
  map : new Array(),

  addToCache : function(longURL, shortURL) {
    AGBShortURLChrome.Cache.map.push({longURL: longURL, shortURL: shortURL});
  },

  get : function(longURL) {
    for(i=0; i<AGBShortURLChrome.Cache.map.length; i++) {
        if(AGBShortURLChrome.Cache.map[i].longURL == longURL)
            return AGBShortURLChrome.Cache.map[i].shortURL;
    }
  },

  removeFromCache : function(longURL) {
    for(i=0; i<AGBShortURLChrome.Cache.map.length; i++) {
        if(AGBShortURLChrome.Cache.map[i].longURL == longURL) {
            AGBShortURLChrome.Cache.map.splice(i, 1);
            break;
        }
    }
  }
};


AGBShortURLChrome.Shortly = {
  urlCache : AGBShortURLChrome.Cache,

  requestShortURL : function(aEvent) {
    let longURL = window.content.location.href;
    if(AGBShortURLChrome.Shortly.urlCache.get(longURL) == null)
        AGBShortURLChrome.Shortly.shortenURL(longURL);
    else
        AGBShortURLChrome.Shortly.displayShortURL(AGBShortURLChrome.Shortly.urlCache.get(longURL));
  },

  shortenURL : function(url) {
    url = encodeURIComponent(url);
    var ioService=Components.classes["@mozilla.org/network/io-service;1"]
        .getService(Components.interfaces.nsIIOService);
    var scriptableStream=Components
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
       }
    }
    var listener = new ServiceListener(AGBShortURLChrome.Shortly.callbackHandler);
    //channel.notificationCallbacks = listener;
    channel.asyncOpen(listener, null);

  },

  callbackHandler : function(result) {
    let shortURL = result.data.url;
    let longURL = result.data.long_url;
    AGBShortURLChrome.Shortly.urlCache.addToCache(longURL, shortURL);
    AGBShortURLChrome.Shortly.displayShortURL(shortURL);
  },

  resetDisplay : function(event) {
    let longURL = window.content.location.href;
    AGBShortURLChrome.Shortly.displayShortURL(AGBShortURLChrome.Shortly.urlCache.get(longURL));
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
  }

};

window.gBrowser.tabContainer.addEventListener('TabSelect', AGBShortURLChrome.Shortly.resetDisplay, false, true);
window.gBrowser.addEventListener('pageshow', AGBShortURLChrome.Shortly.resetDisplay, false);


