// Utilities

addClass = window.utils.addClass;
removeClass = window.utils.removeClass;

// MRAID

var page = new commonMraidLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "AmazingHDVideos",
    suffix: "mraid-lk-airtel-si-default",
    domain: window.mobiOneConstants.domain,
    language: "english",
    pageId: "2363",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId) {
        return true;
    },
    onWillTransition: function(currentState, nextState){
        // prevent automatic transition from default state
        return customizations.preventAutoNumberEntry(page, currentState, nextState);
    },
    path: "apis/jsonp"
});

page.getReady();