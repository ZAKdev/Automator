// Utilities

addClass = window.utils.addClass
removeClass = window.utils.removeClass

// Block the UI for checkbox

var checkbox = document.getElementById("agree");
var $g = !checkbox.checked;

function blockOnCheckbox() {
    return true;
    /*
    if (!!checkbox.checked)
        return true;
    return false;
    */
}

checkbox.addEventListener("change", function() {
    var $s = document.getElementById("subscribe");
    if (this.checked) {
        addClass($s, "subscribe");
        $g = !checkbox.checked;
    } else {
        removeClass($s, "subscribe");
        $g = !checkbox.checked;
    }
});


// MobiOne Script

// add try-subscribe param to query string to make Furqan code work to subscribe the user on visits.
var params = window.mobiOneConstants.queryParams || {};
params.state = 'try-subscribe';
var campaignId = window.mobiOneConstants.campaignId;

var creative = "FitnessTips";
var suffix = "mraid-tr-turkcell-tr-google";

var page = new mraidGoogleLandingPage({
    campaignId: campaignId,
    creative: creative,
    suffix: suffix,
    domain: "pages.mli.me", // note it's not window.mobiOneConstants.domain it must be pages.mli.me in turkey (blame Peter)
    language: "turkish",
    pageId: "2278",
    queryParams: params,
    doubleConfirmation: function(operatorId) {
        return $g;
    },
    onWillTransition: function(currentState, nextState) {
        return true;
    },
    path: "tr/apis/html/" + creative + "/" + suffix.replace(/\-/g, '/') + "/" + campaignId, // note tr/ in beginning (special for turkey)
    onSubscribeClick: blockOnCheckbox
});

page.getReady(function() {

    // stops all animation after 30secs
    setTimeout(function() {
        var $b = document.getElementsByTagName("body")[0];
        addClass($b, "stop-animations");
    }, 25000)

});