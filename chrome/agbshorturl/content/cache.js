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


