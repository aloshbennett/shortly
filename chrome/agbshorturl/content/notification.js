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
            "",
            notificationBox.PRIORITY_INFO_MEDIUM,
            null);

        var messageText = document.getAnonymousElementByAttribute(notification, "anonid", "messageText");
        var fragment = document.createDocumentFragment();
        inputnode = document.createElementNS("http://www.w3.org/1999/xhtml","input");
        inputnode.type="text";
        inputnode.value=shortURL;
        inputnode.readOnly =true;
        inputnode.class = "plain";
        txtnode = document.createTextNode("Copy this value -> ");
        fragment.appendChild(txtnode);
        fragment.appendChild(inputnode);

        messageText.removeChild(messageText.firstChild);
        messageText.appendChild(fragment);

        setTimeout('AGBShortURLChrome.GUI.Notification.clearNotification()', 5000);
    },

    clearNotification: function() {
        notificationBox.removeAllNotifications();
    }
};

