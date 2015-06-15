if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};


AGBShortURLChrome.GUI = {
  
  initializeGUI : function() {
    var addonBarIcon = document.getElementById("agbshorturl-statusbar-icon");
    var urlBoxIcon = document.getElementById("agbshorturl-urlbox-icon");
    if(AGBShortURLChrome.Shortly.prefs.getBooleanValue("addonbar.enable"))
        addonBarIcon.hidden = false;
    else
        addonBarIcon.hidden = true;
    if(AGBShortURLChrome.Shortly.prefs.getBooleanValue("urlbox.enable"))
        urlBoxIcon.hidden = false;
    else
        urlBoxIcon.hidden = true;
  },

  initializeListeners : function() {
    this.setKeyListener();
    this.setContextListener();
  },

  setKeyListener : function() {
    if(AGBShortURLChrome.Shortly.prefs.getBooleanValue("accesskey.enable")) {
        window.addEventListener('keydown', AGBShortURLChrome.Callbacks.keyEvent, false);
    }
    else
        window.removeEventListener('keydown', AGBShortURLChrome.Callbacks.keyEvent, false);
  },

  setContextListener: function() {
    var contextMenu = document.getElementById("contentAreaContextMenu");
    if (contextMenu)
        contextMenu.addEventListener("popupshowing", AGBShortURLChrome.Callbacks.clickFilter, false);
  },

  clickFilter: function(event) {
    var pageItem = document.getElementById("agbshorturl-contextmenu-currpage");
    var imageItem = document.getElementById("agbshorturl-contextmenu-image");
    var linkItem = document.getElementById("agbshorturl-contextmenu-link");
    var separator = document.getElementById("agbshorturl-contextmenu-separator");
    if(!AGBShortURLChrome.Shortly.prefs.getBooleanValue("contextmenu.enable")) {
        pageItem.hidden=true;
        imageItem.hidden=true;
        linkItem.hidden=true;
        separator.hidden=true;
    }else{
        pageItem.hidden = (gContextMenu.onImage || gContextMenu.onLink || gContextMenu.onTextInput || gContextMenu.onMathML || gContextMenu.onMailtoLink || gContextMenu.isContentSelected);
        imageItem.hidden = !gContextMenu.onImage;
        linkItem.hidden = !gContextMenu.onLink;
        separator.hidden = (pageItem.hidden && imageItem.hidden && linkItem.hidden);
    }
  },

  keyEvent : function(event) {
    var keyCombo = AGBShortURLChrome.Shortly.prefs.getStringValue("accesskey.combination");
    if(AGBShortURLChrome.KeyUtils.compareKeyevent(event, keyCombo))
        this.shortenPageURL();
  },

  shortenPageURL: function() {
    AGBShortURLChrome.Shortly.requestShortly(window.content.location.href);
  },

  shortenImageURL: function() {
    if(gContextMenu.imageURL && gContextMenu.imageURL != "")
        AGBShortURLChrome.Shortly.requestShortly(gContextMenu.imageURL);
  },

  shortenLinkURL: function() {
    if(gContextMenu.linkURL && gContextMenu.linkURL != "")
        AGBShortURLChrome.Shortly.requestShortly(gContextMenu.linkURL);
  },

  copyClipboard : function(data) {
    const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].
        getService(Components.interfaces.nsIClipboardHelper);
    gClipboardHelper.copyString(data);
  }

};


