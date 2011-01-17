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
  },

  toggleAccessKey : function() {
    let accessKeyCheckbox = document.getElementById("agbshorturl-prefs-accesskey-flag");
    let accessKeyCombo = document.getElementById("agbshorturl-prefs-accesskey-combo");
    accessKeyCombo.disabled=(!accessKeyCheckbox.checked);
  },

  acceptKeyCombination : function() {
    let accessKeyCombo = document.getElementById("agbshorturl-prefs-accesskey-combo");
    let stringBundle = document.getElementById("agbshorturl-prefs-stringbundle");
    let newComboMessage = stringBundle.getString("agbshorturl.shorlty.options.accesskey.newcombo");
    if(accessKeyCombo.value!=newComboMessage)
        AGBShortURLChrome.Options.lastValidCombination = accessKeyCombo.value;
    accessKeyCombo.value=newComboMessage;
    accessKeyCombo.readOnly=true;
    accessKeyCombo.addEventListener('keydown', AGBShortURLChrome.Options.verifyKeyStroke, false);
  },

  verifyKeyStroke : function(event) {
    let accessKeyCombo = document.getElementById("agbshorturl-prefs-accesskey-combo");
    let accessKeyCheckbox = document.getElementById("agbshorturl-prefs-accesskey-flag");
    if(AGBShortURLChrome.KeyUtils.isAllowed(event)==1) {
        accessKeyCombo.value = AGBShortURLChrome.KeyUtils.keyev2string(event);
        AGBShortURLChrome.Options.lastValidCombination = accessKeyCombo.value;
        accessKeyCheckbox.focus();
    }
  },

  validateKeyCombination : function() {
    let accessKeyCombo = document.getElementById("agbshorturl-prefs-accesskey-combo");
    accessKeyCombo.readOnly=false;
    accessKeyCombo.value = AGBShortURLChrome.Options.lastValidCombination;
    accessKeyCombo.removeEventListener('keydown', AGBShortURLChrome.Options.verifyKeyStroke, false);
  }


};

