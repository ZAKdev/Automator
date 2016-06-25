var page = new commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "FitnessTips",
    suffix: "html5-au-_-en-default",
    domain: window.mobiOneConstants.domain,    
    doubleConfirmation: false,
    language: "english",
    pageId: "2080",
    queryParams: window.mobiOneConstants.queryParams,
    onWillTransition: function(currentState, nextState){
        if (currentState.name == "congrats" && nextState.name == "service-page" && !nextState.forced){
            setTimeout(function(){
                nextState.forced = true
                page.setState(nextState, {action: "customization"}, {redirectUrl: nextState.nextUrl})
            }, 15000)
            return false;
        }
        return true;
    },
    path: "apis/jsonp",
});

page.getReady();
