var page = new mraidGoogleLandingPage({
	campaignId: window.mobiOneConstants.campaignId,
	creative: "TrainYourBrain",
	suffix: "mraid-gb-_-en-google",
	domain: "start.mobileacademy.com",
	doubleConfirmation: true,	
	language: "english",
	pageId: "1860",
	path: "cmps/"
});

page.getReady(function() {

	var min = 123
	var max = 456;
	var randomNumber = Math.floor(Math.random() * (max - min)) + min;
	document.getElementById("count").innerHTML = randomNumber;

	var counter = setInterval(function() {
		randomNumber = randomNumber + 1;
		document.getElementById("count").innerHTML = randomNumber;
	}, 2000);
	var timout = setTimeout(function() {
		clearInterval(counter);
	}, 30000);

    setTimeout(function(){
        document.body.classList.add("stop-animations");
    }, 25000);

});

