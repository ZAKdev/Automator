// Utilities
addClass = window.utils.addClass;
removeClass = window.utils.removeClass;

// HTML5

var page = new commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "FitnessTips",
    suffix: "html5-ae-du-en-default",
    domain: window.mobiOneConstants.domain,
    language: "english",
    pageId: "1329",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId) {
        return false;
    },
    onWillTransition: function(currentState, nextState) {
        return customizations.preventAutoNumberEntry(page, currentState, nextState, function(e) {
            return {
                selectedLanguage: prelude.find(function(element) {
                    return element.tagName == "INPUT" && element.checked
                })(document.getElementsByName("language")).value
            };
        });
    },
    forcedPage: "",
    path: "apis/jsonp",
    mapIframeConfirmationUrl: function(url) {
        return url + "&color1=00bd44&color2=f4f4f4&color3=00bd44"
    }
});

page.getReady();