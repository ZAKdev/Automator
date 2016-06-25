
// MobiOne API

var page = new commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "TrainYourBrain",
    suffix: "html5-ke-airtel-en-default",
    domain: window.mobiOneConstants.domain,    
    language: "english",
    pageId: "2196",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId){      
        return true;
    },
    onWillTransition: function(currentState, nextState){
        // prevent automatic transition from default state
        return customizations.preventAutoNumberEntry(page, currentState, nextState);
    },
    path: "apis/jsonp"
});

page.getReady();
