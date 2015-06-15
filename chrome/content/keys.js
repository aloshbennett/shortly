if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};

AGBShortURLChrome.KeyManager = function() {
  this.prefs = new AGBShortURLChrome.Preferences();
}

AGBShortURLChrome.KeyManager.prototype = {

  readKey : function() {
    var key = this.prefs.getStringValue("key");
    alert('returning ' + key + ' from the store');
    return key;
  },

  setNewKey : function() {
    var ioService=Components.classes["@mozilla.org/network/io-service;1"]
        .getService(Components.interfaces.nsIIOService);
    var scriptableStream = Components
        .classes["@mozilla.org/scriptableinputstream;1"]
        .getService(Components.interfaces.nsIScriptableInputStream);
    var keyURL = 'http://localhost/ruby/test.rb';
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
    var listener = new ServiceListener(function(result) {self.serviceDataHandler(result);});
    channel.asyncOpen(listener, null);
  },

  serviceDataHandler: function(result) {
    alert('setting key ' + ' to the store');
    this.prefs.setStringValue("key", result);
  }

};

