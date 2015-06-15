if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};

AGBShortURLChrome.Cache = function() {
    this.map = new Array();
}

AGBShortURLChrome.Cache.prototype = {

  addToCache : function(key, value) {
    this.map.push({key: key, value: value});
  },

  get : function(key) {
    for(i=0; i<this.map.length; i++) {
        if(this.map[i].key == key)
            return this.map[i].value;
    }
  },

  removeFromCache : function(key) {
    for(i=0; i<this.map.length; i++) {
        if(this.map[i].key == key) {
            this.map.splice(i, 1);
            break;
        }
    }
  }
};

