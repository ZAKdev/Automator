var page = new commonMraidLandingPage({
	campaignId: window.mobiOneConstants.campaignId,
	creative: "FitnessTips",
	suffix: "mraid-lk-_-en-default",
	domain: "wap.mozook.com/srilanka/mobi-one",
	language: "english",
	pageId: "1363",
	path: "apis/jsonp",
	queryParams: window.mobiOneConstants.queryParams,
	doubleConfirmation: function(operatorId){      
	return true;
	},
		onWillTransition: function(currenState, nextState) {
		if(nextState.name == "show-default-state" || "show-subscribe-button" || "double-confirmation") {
			var operatorId = page.getState().operatorId;
			
			// 252 Dialog
			if (operatorId === 252) {

				document.getElementById("dialog-section-disclaimer").style.display = "block";
				document.getElementById("airtel-section-disclaimer").style.display = "none";
				document.getElementById("mobitel-section-disclaimer").style.display = "none";

				document.getElementById("dialog-mobitel-section-double").style.display = "block";
				document.getElementById("airtel-section-double").style.display = "none";


				document.getElementById("subscribe_link").style.display = "none";
				document.getElementById("cancel_link").style.display = "none";

				document.getElementById("yes_link").style.display = "block";
				document.getElementById("no_link").style.display = "block";

			}
			// 147 Airtel
			if (operatorId === 147){

				document.getElementById("airtel-section-disclaimer").style.display = "block";
				document.getElementById("dialog-section-disclaimer").style.display = "none";
				document.getElementById("mobitel-section-disclaimer").style.display = "none";

				document.getElementById("airtel-section-double").style.display = "block";
				document.getElementById("dialog-mobitel-section-double").style.display = "none";


				document.getElementById("subscribe_link").style.display = "block";
				document.getElementById("cancel_link").style.display = "block";

				document.getElementById("yes_link").style.display = "none";
				document.getElementById("no_link").style.display = "none";

			}

			// 198 Mobitel
			if (operatorId === 198){

				document.getElementById("mobitel-section-disclaimer").style.display = "block";
				document.getElementById("airtel-section-disclaimer").style.display = "none";
				document.getElementById("dialog-section-disclaimer").style.display = "none";

				document.getElementById("dialog-mobitel-section-double").style.display = "block";
				document.getElementById("airtel-section-double").style.display = "none";


				document.getElementById("subscribe_link").style.display = "none";
				document.getElementById("cancel_link").style.display = "none";

				document.getElementById("yes_link").style.display = "block";
				document.getElementById("no_link").style.display = "block";

			}
		}
		return true;
	}
});

page.getReady();
