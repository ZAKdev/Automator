// Utilities

addClass = window.utils.addClass;
removeClass = window.utils.removeClass;

// Mraid

var page = commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "PokemonGo",
    suffix: "html5-in-vodafone-in-default",
    domain: "wap.mozook.com",
    language: "english",
    pageId: "2531",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId) {
        return true;
    },
    onWillTransition: function(currentState, nextState) {
        return customizations.preventAutoNumberEntry(page, currentState, nextState, function(e) {
            return { selectedLanguage: prelude.find(function(element) {
                    return element.tagName == "INPUT" && element.checked })(document.getElementsByName("language")).value };
        });
    },
    path: "cmps/"
});

page.getReady();
