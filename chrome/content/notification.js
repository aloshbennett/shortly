if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};


AGBShortURLChrome.GUI.Notification = {
    timerCache: new AGBShortURLChrome.Cache(),

    displayNotification: function(shortURL) {
        var notificationBox = gBrowser.getNotificationBox();
        var notification = notificationBox.appendNotification(
            "",
            "shortly-"+shortURL,
            "chrome://agbshorturl/skin/images/icon_m.png",
            notificationBox.PRIORITY_INFO_MEDIUM,
            null);

        var messageText = document.getAnonymousElementByAttribute(notification, "anonid", "messageText");
        var fragment = document.createDocumentFragment();
        let stringBundle = document.getElementById("agbshorturl-prefs-stringbundle");
        let delay = 5000;
        if(AGBShortURLChrome.Shortly.prefs.getBooleanValue("clipboard.enable")) {
            let txtnode = document.createTextNode(stringBundle.getFormattedString("agbshorturl.shorlty.notification.clipboard.message", [shortURL]));
            fragment.appendChild(txtnode);
        } else {
            let inputnode = document.createElementNS("http://www.w3.org/1999/xhtml","input");
            inputnode.type="text";
            inputnode.value=shortURL;
            inputnode.readOnly =true;
            inputnode.class = "plain";
            delay=10000;
            let txtnode = document.createTextNode(stringBundle.getString("agbshorturl.shorlty.notification.noclipboard.message")+" ");
            fragment.appendChild(txtnode);
            fragment.appendChild(inputnode);
        }
        messageText.removeChild(messageText.firstChild);
        messageText.appendChild(fragment);
        var event = {
          notify: function(timer) {
            AGBShortURLChrome.GUI.Notification.clearNotification(notificationBox);
            AGBShortURLChrome.GUI.Notification.timerCache.removeFromCache(timer);
          }
        };
        var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
        timer.initWithCallback(event,delay, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
        this.timerCache.addToCache(timer, timer);
    },

    clearNotification: function(notificationBox) {
        notificationBox.removeAllNotifications();
    }
};

