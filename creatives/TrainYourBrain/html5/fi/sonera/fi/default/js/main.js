
// MobiOne Script

var page = commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "TrainYourBrain",
    suffix: "html5-fi-sonera-fi-default",
    domain: "suomi1.txtnation.com",
    doubleConfirmation: true,
    language: "finnish",
    pageId: "2268",
    queryParams: window.mobiOneConstants.queryParams,
    onWillTransition: function(currentState, nextState){
        return customizations.preventAutoNumberEntry(page, currentState, nextState, function(e) {
            return {selectedLanguage: prelude.find(function(element){ return element.tagName == "INPUT" && element.checked })(document.getElementsByName("language")).value};
        });
    },
    path: "apis/jsonp"
});

page.getReady();
