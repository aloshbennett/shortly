if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};

AGBShortURLChrome.Core = function(){
  this.callback= null;
}

AGBShortURLChrome.Core.prototype = {

  shortenURL : function(url) {
    url = encodeURIComponent(url);
    var ioService=Components.classes["@mozilla.org/network/io-service;1"]
        .getService(Components.interfaces.nsIIOService);
    var scriptableStream = Components
        .classes["@mozilla.org/scriptableinputstream;1"]
        .getService(Components.interfaces.nsIScriptableInputStream);
    var bitlyURL = 'http://api.bit.ly/v3/shorten?login=oneclickshorten&apiKey=R_66e801e8a9a088ded55f075f78eb7d90&longUrl='+url+'&format=json';
    var channel=ioService.newChannel(bitlyURL,null,null);

    function ServiceListener(dataCallback) {
        this.dataCallback = dataCallback;
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
            this.dataCallback(JSON.parse(this.serviceData));
        },

    };

    var self = this;
    var listener = new ServiceListener(function(result) {self.serviceDataHandler(result);});
    channel.asyncOpen(listener, null);

  },

  serviceDataHandler: function(result) {
    let shortURL = result.data.url;
    let longURL = result.data.long_url;
    this.callback(longURL, shortURL);
  }

};
