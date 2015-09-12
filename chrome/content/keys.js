if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};

AGBShortURLChrome.KeyManager = function() {
  this.prefs = null;
}

AGBShortURLChrome.KeyManager.prototype = {

  readKey : function() {
    var key = this.prefs.getStringValue("key");
    var a = [0, 1, 20];
    a.push(key);
    a.push(a[3].length);
    a.push(a[3].charAt(a[0]));
    a.push(a[3].charCodeAt(a[0])%a[2]+a[1]);
    a.push(a[4] - a[6]);
    var keyAlt = a[5] + a[3].slice(a[7], a[4]) + a[3].slice(a[1], a[7]);
    return keyAlt;
  },

  readExpiry : function() {
    var expiryStr = this.prefs.getStringValue("key.expiry");
    return parseInt(expiryStr);
  },

  isExpired : function() {
    var expiry = this.readExpiry();
    var now = new Date();
    return (expiry < now.getTime());
  },

  refreshKey : function(force, onSuccess) {
    if(force || this.isExpired())
      this.setNewKey(onSuccess);
  },

  setNewKey : function(onSuccess) {
    var ioService=Components.classes["@mozilla.org/network/io-service;1"]
        .getService(Components.interfaces.nsIIOService);
    var scriptableStream = Components
        .classes["@mozilla.org/scriptableinputstream;1"]
        .getService(Components.interfaces.nsIScriptableInputStream);
    var keyURL = 'http://aloshbennett.in/shortly/key.rb';
    var channel=ioService.newChannel(keyURL, null, null);

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
            this.dataCallback(this.serviceData, status);
        },

    };

    var self = this;
    var listener = new ServiceListener(function(result, status) {
      if (status == Components.results.NS_OK) {
        var resultJson = JSON.parse(result);
        self.prefs.setStringValue("key", resultJson.key);
        var date = new Date();
        self.prefs.setStringValue("key.expiry", date.getTime() + resultJson.expiry);
        if(onSuccess)
          onSuccess();
      }
    });
    channel.asyncOpen(listener, null);
  }

};

