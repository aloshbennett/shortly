if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};

AGBShortURLChrome.KeyManager = function() {
  this.prefs = null;
}

AGBShortURLChrome.KeyManager.prototype = {

  readKey : function() {
    var key = this.prefs.getStringValue("key");
    return key;
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
            this.dataCallback(this.serviceData);
        },

    };

    var self = this;
    var listener = new ServiceListener(function(result) {
      var resultJson = JSON.parse(result);
      self.prefs.setStringValue("key", resultJson.key);
      var date = new Date();
      self.prefs.setStringValue("key.expiry", date.getTime() + resultJson.expiry);
      if(onSuccess)
        onSuccess();
    });
    channel.asyncOpen(listener, null);
  }

};

