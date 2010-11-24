if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};

AGBShortURLChrome.ArrayList = {
  list : new Array(),

  addToList : function(object) {
    AGBShortURLChrome.ArrayList.list.push(object);
  },

  isPresent : function(object) {
    for(i=0; i<AGBShortURLChrome.ArrayList.list.length; i++) {
        if(AGBShortURLChrome.ArrayList.list[i] == object)
            return true;
    }
    return false;
  },

  removeFromList : function(object) {
    for(i=0; i<AGBShortURLChrome.ArrayList.list.length; i++) {
        if(AGBShortURLChrome.ArrayList.list[i] == object) {
            AGBShortURLChrome.ArrayList.list.splice(i, 1);
            break;
        }
    }
  }
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
  callList : AGBShortURLChrome.ArrayList,

  urlCache : AGBShortURLChrome.Cache,

  requestShortURL : function(aEvent) {
    let longURL = window.content.location.href;
    if(AGBShortURLChrome.Shortly.urlCache.get(longURL) == null)
        AGBShortURLChrome.Shortly.shortenURL(longURL);
    else
        AGBShortURLChrome.Shortly.displayShortURL(AGBShortURLChrome.Shortly.urlCache.get(longURL));
  },

  shortenURL : function(url) {
    AGBShortURLChrome.Shortly.callList.addToList(url);
    url = encodeURIComponent(url);
    script = window.content.document.createElement('script');
    script.type = 'text/javascript';
      function agbshorturlchrome_shortly_callback(result) {
        var dataNode = document.createElement('AGBShortURLChromeDataNode');
        dataNode.setAttribute('longURL', document.URL);
        dataNode.setAttribute('shortURL', result.data.url);
        document.documentElement.appendChild(dataNode);
        var event = document.createEvent('Event');
        event.initEvent('AGBShortURLChrome.shortly.callbackEvent', true, false);
        dataNode.dispatchEvent(event);
      }
    scriptCode = window.content.document.createTextNode(agbshorturlchrome_shortly_callback);
    script.appendChild(scriptCode);
    window.content.document.body.appendChild(script);
    script = window.content.document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://api.bit.ly/v3/shorten?login=oneclickshorten&apiKey=R_66e801e8a9a088ded55f075f78eb7d90&longUrl='+url+'&format=json&callback=agbshorturlchrome_shortly_callback';
    window.content.document.body.appendChild(script);
  },

  callbackEventHandler : function(event) {
    let shortURL = event.target.getAttribute('shortURL');
    let longURL = event.target.getAttribute('longURL');
    if(!AGBShortURLChrome.Shortly.callList.isPresent(longURL))
        return;
    AGBShortURLChrome.Shortly.callList.removeFromList(longURL);
    AGBShortURLChrome.Shortly.urlCache.addToCache(longURL, shortURL);
    AGBShortURLChrome.Shortly.displayShortURL(shortURL);
  },

  displayShortURL : function(shortURL) {
    let shortURLBar = document.getElementById("agbshorturl-statusbar-urltext");
    shortURLBar.value = shortURL;
    shortURLBar.size = shortURL.length-3;
  },

  genericHandler : function(event) {
    alert("generic event: "+event.name);
    alert(event);
  }
};

window.addEventListener('AGBShortURLChrome.shortly.callbackEvent', AGBShortURLChrome.Shortly.callbackEventHandler, false, true);
window.addEventListener('onlocationchange', AGBShortURLChrome.Shortly.genericHandler, false, true);

