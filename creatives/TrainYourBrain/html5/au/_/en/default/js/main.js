
var userClick = false;

var page = new commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "TrainYourBrain",
    suffix: "html5-au-_-en-default",
    domain: "wap.mozook.com", //window.mobiOneConstants.domain,    
    language: "english",
    pageId: "2131",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId){      
        return false;
    },
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
    path: "uae/mobi-one/apis/jsonp" //"apis/jsonp"
});

page.getReady();
