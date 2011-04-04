if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};


AGBShortURLChrome.GUI.Notification = {
    notificationBox: gBrowser.getNotificationBox(),

    displayNotification: function(shortURL) {
        notificationBox = gBrowser.getNotificationBox();
        var notification = notificationBox.appendNotification(
            "",
            "shortly-"+shortURL,
            "chrome://agbshorturl/skin/images/icon_m.png",
            notificationBox.PRIORITY_INFO_MEDIUM,
            null);

        var messageText = document.getAnonymousElementByAttribute(notification, "anonid", "messageText");
        var fragment = document.createDocumentFragment();
        let stringBundle = document.getElementById("agbshorturl-prefs-stringbundle");
        if(AGBShortURLChrome.Shortly.prefs.getBooleanValue("clipboard.enable")) {
            let txtnode = document.createTextNode(stringBundle.getFormattedString("agbshorturl.shorlty.notification.clipboard.message", [shortURL]));
            fragment.appendChild(txtnode);
        } else {
            let inputnode = document.createElementNS("http://www.w3.org/1999/xhtml","input");
            inputnode.type="text";
            inputnode.value=shortURL;
            inputnode.readOnly =true;
            inputnode.class = "plain";
            let txtnode = document.createTextNode(stringBundle.getString("agbshorturl.shorlty.notification.noclipboard.message")+" ");
            fragment.appendChild(txtnode);
            fragment.appendChild(inputnode);
        }
        messageText.removeChild(messageText.firstChild);
        messageText.appendChild(fragment);

        setTimeout('AGBShortURLChrome.GUI.Notification.clearNotification()', 5000);
    },

    clearNotification: function() {
        notificationBox.removeAllNotifications();
    }
};

