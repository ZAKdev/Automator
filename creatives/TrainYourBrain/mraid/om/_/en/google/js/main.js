
// Utilities

addClass = window.utils.addClass;
removeClass = window.utils.removeClass;

/* Custom */

var subscribeBtn = document.getElementById('subscribe'),
    linkBtn = document.getElementById('subscribe-link')
    imgLabel = document.querySelector('.label'),
    imgGirl = document.querySelector('.catdog'),
    imgDog = document.querySelector('#dog'),
    imgCats = document.querySelector('#cats'),
    Or = document.querySelector('#or'),
    Timer = document.querySelector('.timer'),
    msg2 = document.querySelector('#msg2'),
    cancel = document.getElementById('double-confirmation-no');

function subscribeBtnAction(){
    imgLabel.classList.add('accept');
    imgGirl.classList.add('accept');
    imgDog.style.display="none";
    imgCats.style.display="none";
    Or.style.display="none";
    Timer.classList.add('accept');
    msg2.style.display="block";
}

function cancelBtnAction(){
    imgLabel.classList.remove('accept');
    imgGirl.classList.remove('accept');
    imgDog.style.display="block";
    imgCats.style.display="block";
    Or.style.display="block";
    Timer.classList.remove('accept');
    msg2.style.display="none";
}

/* MobiOne */

var campaignId = window.mobiOneConstants.campaignId;
var creative = "TrainYourBrain";
var suffix = "mraid-om-_-en-google";
var params = window.mobiOneConstants.queryParams || {};
params.state = 'try-subscribe';

var page = new mraidGoogleLandingPage({
	campaignId: window.mobiOneConstants.campaignId,
	creative: "TrainYourBrain",
	suffix: "mraid-ae-du-en-google",
	domain: "start.mobileacademy.com",
	language: "english",
	pageId: "2111",
	queryParams: params,
    path: "",
    doubleConfirmation: function(operatorId){      
        return true;
    },
    onWillTransition: function(currentState, nextState){
        return true;
    }
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
                    document.getElementsByTagName('body')[0].className+=' stop-animations';
                    clearInterval(interval);
                }
            }, 1000);
        }
    }

    var time = 25, display = document.getElementById("count");
    startTimer(time, display, true);

    subscribeBtn.addEventListener('click',subscribeBtnAction);
    linkBtn.addEventListener('click',subscribeBtnAction);
    cancel.addEventListener('click',cancelBtnAction);    

});
