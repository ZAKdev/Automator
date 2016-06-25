
// MobiOne API

var page = new commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "AmazingHDVideos",
    suffix: "html5-sd-arabiacell-ar-default",
    domain: window.mobiOneConstants.domain,
    language: "arabic",
    pageId: "2329",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId){
        return true;
    },
    path: "apis/jsonp"
});

page.getReady();
