function weiToEther(wei) {
    return wei.dividedBy(new BigNumber("1000000000000000000")); // 1e18
}

function ethToWei(eth) {
    return eth.times(new BigNumber("1000000000000000000")); // 1e18
}

function formatFloat(n, places, noCommas) {
    var places  = ((typeof(places) == "undefined" || places == null) ? 2 : places); // places can be 0
    var rounded =  parseFloat(n).toFixed(places);
    if (places > 2) {
        if (rounded.endsWith('0')) { rounded = rounded.replace(/00+$/, 0) }
    }
    var finalFormat = parseFloat(rounded).toLocaleString('en', {maximumFractionDigits: places});
    if (noCommas) {
        return finalFormat.replace(/,/g,'');
    } else {
        return finalFormat;
    }
}


function validateAddress(address) {
    if (address && address.length > 0) {
	if (address.startsWith('0x')) {
	    if (WEB3.isAddress(address)) {
		return { valid: true };
	    } else {
		return {
		    valid:   false,
		    message: "Address is not valid."
		};	
	    }
	} else {
	    return {
		valid:   false,
		message: "Address must start with the letters '0x'."
	    };
	}
    } else {
	return {
	    valid:   false,
	    message: "Address is required."
	};
    }
}

function getAddressBalance(address, callback, errback) {
    connectionAlive(
	function() {
	    WEB3.eth.getBalance(address.toLowerCase(), function(error, balance) {
		if (error) { 
		    console.error(error);
		    errback(error);
		}
		else { 
		    callback(weiToEther(balance));
		}
	    });
	},
	function(message) { errback(message); }
    );
}

// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser

// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

// Mist detection
var isMist = typeof(mist) !== "undefined";

function browserFamily() {
    if (isMist)    { return "Mist";    }
    if (isChrome)  { return "Chrome";  }
    if (isFirefox) { return "Firefox"; }
    if (isSafari)  { return "Safari";  }
    if (isOpera)   { return "Opera";   }
    if (isEdge)    { return "Edge";    }
    if (isIE)      { return "MSIE";    }
    if (isBlink)   { return "Blink";   }
    return "Unknown";
}

function nodeFamily(nodeText) {
    if (/.*Parity.*/.test(nodeText)) {return "Parity"; }
    if (/.*MetaMask.*/.test(nodeText)) {return "Metamask"; }
    if (/.*Geth.*/.test(nodeText)) {return "Geth"; }
    return "Other/Unknown";
}
       
function enableSyntaxHighlighting() {
    hljsDefineSolidity(hljs);
    hljs.initHighlighting();
}

$(function () {
    enableSyntaxHighlighting();
});

