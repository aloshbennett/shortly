if ("undefined" == typeof(AGBShortURLChrome)) {
  var AGBShortURLChrome = {};
};

AGBShortURLChrome.Shortly = {
  displayShortURL : function(aEvent) {
    AGBShortURLChrome.Shortly.shortenURL(window.content.location.href);
  },

  shortenURL : function(url) {
    url = encodeURIComponent(url);
    script = window.content.document.createElement('script');
    script.type = 'text/javascript';
      function agbshorturlchrome_shortly_callback(result) {
        var dataNode = document.createElement('AGBShortURLChromeDataNode');
        dataNode.setAttribute('longURL', document.URL);
        dataNode.setAttribute('shortURL', result.data.url);
        document.documentElement.appendChild(dataNode);
        var event = document.createEvent('Event');
        event.initEvent('AGBShortURLChrome.shortly.callbackEvent', true, false);
        dataNode.dispatchEvent(event);
      }
    scriptCode = window.content.document.createTextNode(agbshorturlchrome_shortly_callback);
    script.appendChild(scriptCode);
    window.content.document.body.appendChild(script);
    script = window.content.document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://api.bit.ly/v3/shorten?login=oneclickshorten&apiKey=R_66e801e8a9a088ded55f075f78eb7d90&longUrl='+url+'&format=json&callback=agbshorturlchrome_shortly_callback';
    window.content.document.body.appendChild(script);
  },

  callbackEventHandler : function(event) {
    let shortURLBar = document.getElementById("agbshorturl-statusbar-urltext");
    let shortURL = event.target.getAttribute('shortURL');;
    //window.alert(event.target.getAttribute('longURL'));
    //window.alert(event.target.getAttribute('shortURL'));
    shortURLBar.value = shortURL;
    shortURLBar.size = shortURL.length-5;
    //shortURLBar.selectionStart=0;
    //shortURLBar.selectionEnd=shortURL.length;
    //shortURLBar.maxlength = shortURL.length;
  }

};

window.addEventListener('AGBShortURLChrome.shortly.callbackEvent', AGBShortURLChrome.Shortly.callbackEventHandler, false, true);

