AGBShortURLChrome.Options = {
  lastValidCombination : null,
  displayPrefs : function() {
    let clipboardCheckbox = document.getElementById("agbshorturl-prefs-clipboard-flag");
    let accessKeyCheckbox = document.getElementById("agbshorturl-prefs-accesskey-flag");
    let accessKeyCombo = document.getElementById("agbshorturl-prefs-accesskey-combo");
    clipboardCheckbox.checked=AGBShortURLChrome.Shortly.prefs.getBoolPref("clipboard.enable");
    accessKeyCheckbox.checked=AGBShortURLChrome.Shortly.prefs.getBoolPref("accesskey.enable");
    accessKeyCombo.value=AGBShortURLChrome.Shortly.prefs.getCharPref("accesskey.combination");
    accessKeyCombo.disabled=(!accessKeyCheckbox.checked);
  },

  savePrefs : function() {
    let clipboardCheckbox = document.getElementById("agbshorturl-prefs-clipboard-flag");
    let accessKeyCheckbox = document.getElementById("agbshorturl-prefs-accesskey-flag");
    let accessKeyCombo = document.getElementById("agbshorturl-prefs-accesskey-combo");
    if(AGBShortURLChrome.Shortly.prefs.getBoolPref("clipboard.enable")!=clipboardCheckbox.checked)
        AGBShortURLChrome.Shortly.prefs.setBoolPref("clipboard.enable",clipboardCheckbox.checked);
    if(AGBShortURLChrome.Shortly.prefs.getBoolPref("accesskey.enable")!=accessKeyCheckbox.checked)
        AGBShortURLChrome.Shortly.prefs.setBoolPref("accesskey.enable",accessKeyCheckbox.checked);
    if(AGBShortURLChrome.Shortly.prefs.getCharPref("accesskey.combination")!=accessKeyCombo.value)
        AGBShortURLChrome.Shortly.prefs.setCharPref("accesskey.combination",accessKeyCombo.value);
    AGBShortURLChrome.Shortly.loadPrefs();
  },

  toggleAccessKey : function() {
    let accessKeyCheckbox = document.getElementById("agbshorturl-prefs-accesskey-flag");
    let accessKeyCombo = document.getElementById("agbshorturl-prefs-accesskey-combo");
    accessKeyCombo.disabled=(!accessKeyCheckbox.checked);
  },

  acceptKeyCombination : function() {
    let accessKeyCombo = document.getElementById("agbshorturl-prefs-accesskey-combo");
    if(accessKeyCombo.value!="Type new shortcut now...")
        AGBShortURLChrome.Options.lastValidCombination = accessKeyCombo.value;
    accessKeyCombo.value="Type new shortcut now...";
    accessKeyCombo.readOnly=true;
    accessKeyCombo.addEventListener('keydown', AGBShortURLChrome.Options.verifyKeyStroke, false);
  },

  verifyKeyStroke : function(event) {
    //alert(event);
    let accessKeyCombo = document.getElementById("agbshorturl-prefs-accesskey-combo");
    if(KeyUtils.isAllowed(event)==1) {
        accessKeyCombo.value = KeyUtils.keyev2string(event);
        AGBShortURLChrome.Options.lastValidCombination = accessKeyCombo.value;
    }
  },

  validateKeyCombination : function() {
    let accessKeyCombo = document.getElementById("agbshorturl-prefs-accesskey-combo");
    accessKeyCombo.readOnly=false;
    accessKeyCombo.value = AGBShortURLChrome.Options.lastValidCombination;
    accessKeyCombo.removeEventListener('keydown', AGBShortURLChrome.Options.verifyKeyStroke, false);
  }


};

