var page = commonLandingPage({
	campaignId: window.mobiOneConstants.campaignId,
	creative: "FitnessTips",
	suffix: "html5-ae-du-ar-default",
	domain: "wap.mozook.com",
	doubleConfirmation: true,	
	language: "arabic",
	pageId: "1332",
	queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId){      
    	return true;
    },
    onWillTransition: function(currentState, nextState){
    	return true;
    },
	path: "uae/"
});

page.getReady()
