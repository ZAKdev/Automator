
var page = new commonMraidLandingPage({
	campaignId: window.mobiOneConstants.campaignId,
	creative: "TrainYourBrain",
	suffix: "mraid-ch-sunrise-de-default",
	domain: "start.mobileacademy.com",
    doubleConfirmation: false,
	language: "german",
	pageId: "2185",
	path: "cmps/",
    onWillTransition: function(currentState, nextState) {
        if (nextState.name == 'double-confirmation') {
            document.querySelector('.label').classList.add('accept');
            document.querySelector('.catdog').classList.add('accept');
            document.querySelector('#dog').style.display="none";
            document.querySelector('#cats').style.display="none";
            document.querySelector('#or').style.display="none";
            document.querySelector('.timer').classList.add('accept');
            return true;
        } else {
            document.querySelector('.label').classList.remove('accept');
            document.querySelector('.catdog').classList.remove('accept');
            document.querySelector('#dog').style.display="";
            document.querySelector('#cats').style.display="";
            document.querySelector('#or').style.display="";
            document.querySelector('.timer').classList.remove('accept');
            return true;
        }
    },
});

page.getReady(function(){

    /*
    Timer script, after 25secs it will stop. This script is for Google RTB only,
    if you will use this for HTML5, just comment the "stop-animations" line & update
    the timer value (60 * 1 = 1 minute) - Genesis
    */

    function startTimer(duration, display, isRunning) {
        if (!!isRunning) {
            var timer = duration, minutes, seconds;
            var interval = setInterval(function () {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                display.innerHTML = minutes + ":" + seconds;
                if (--timer < 0){
                    timer = 0;
                    // document.getElementsByTagName('body')[0].className+=' stop-animations';
                    clearInterval(interval);
                }
            }, 1000);
        }
    }

    var time = 60 * 1, display = document.getElementById("count");
    startTimer(time, display, true);

});
