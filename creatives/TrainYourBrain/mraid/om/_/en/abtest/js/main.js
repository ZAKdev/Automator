
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

changeClickListener = (function() {
    var changed = false;
    return function() {
        if (!changed) {
            changed = true;
            var subscribeButtons = document.getElementsByClassName("subscribe");
            for (var i = 0; i < subscribeButtons.length; i++) {
                subscribeButtons[i].addEventListener("click", function(e) {
                    if (window.mraid)
                        window.mraid.open("http://mobileacademy.com");
                    else
                        window.open("http://mobileacademy.com");  
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }, true);
            }
        }
    }
})();

var page = new commonMraidLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "TrainYourBrain",
    suffix: "mraid-om-_-en-abtest",
    domain: "start.mobileacademy.com",
    language: "english",
    pageId: "2393", 
    queryParams: window.mobiOneConstants.queryParams,
    subMethodDetectionFailureFallbackUrl: "http://mobileacademy.com",
    nonDirectWapFallbackUrl: "http://mobileacademy.com",
    doubleConfirmation: function(operatorId){
      return true;
    },
    onWillTransition: function(currentState, nextState){
        return customizations.preventAutoNumberEntry(page, currentState, nextState);
    },
    path: "",
    render: function(state) {
        // if sub method is not directwap, add changeClickListener on subscribe button
        if (state.selectedSubMethod && state.selectedSubMethod != "DirectWAP")
            changeClickListener();
    }
});


page.getReady(function(){

    var mins = 1;
    var secs = mins * 60;
    var currentSeconds = 0;
    var currentMinutes = 0;
    var timer = setTimeout('Decrement()', 1000);
    var timeStart = 1;
    var timeEnd = 00;
    Decrement = function () {
        if (timeStart != timeEnd) {
            currentMinutes = Math.floor(secs / 60);
            currentSeconds = secs % 60;
            secs--;
            if (currentSeconds <= 9) currentSeconds = ("0" + currentSeconds);
            if (currentMinutes <= 9) currentMinutes = ("0" + currentMinutes);
            document.getElementById("count").innerHTML = currentMinutes + ":" + currentSeconds;
            if (secs !== -1) setTimeout('Decrement()', 1000);
            timeStart++;
        } else {
            clearTimeout(timer);
        }
    }

    subscribeBtn.addEventListener('click',subscribeBtnAction);
    linkBtn.addEventListener('click',subscribeBtnAction);
    cancel.addEventListener('click',cancelBtnAction);

    // remove preloader once the page fully loaded
    var preloader = document.getElementById("preloader");
    var viewarea = document.getElementById("view-area");
    setTimeout(function() {
        preloader.className = "fadeout";
        viewarea.style.visibility = "visible";
        setTimeout(function() {
            preloader.style.display = "none";
        },1500);
    },2500);

    /*  *******       *******       *******
        *******       *******       *******
        *******       *******       *******

        Scratch Card Effect Script
        https://www.thewebtaylor.com/articles/html5javascript-scratchcard-script

        *******       *******       *******
        *******       *******       *******
        *******       *******       *******
    */

    var isDrawing, lastPoint;
    var container    = document.getElementById('scratch-container'),
        canvas       = document.getElementById('scratch-canvas'),
        canvasWidth  = canvas.width,
        canvasHeight = canvas.height,
        ctx          = canvas.getContext('2d'),
        image        = new Image(),
        brush        = new Image(),
        scratched    = 22;

    var scratchCanvas = document.getElementById("scratch-canvas");

    // cover based on 64bit http://b64.io/
    image.src = 'data:image/jpeg;base64,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';
    image.onload = function() {
        ctx.drawImage(image, 0, 0);
    };

    // brush based on 64bit http://b64.io/
    brush.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABa1BMVEUAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdjOPOAAAAeXRSTlMAAAQGCgwQEhYXGx0hIyYoLC4zNzg8PkNGSEtNUFJVV1pcX2FkZWhqbW5xc3Z3enx/gIOEh4iLjI+Qk5SXmJucnqCio6anqaqtrrCxs7S2uLq7vb7AwcPExsfIycvMzs/Q0dPU1dbY2drb3N3f4ePl5+jp6uvs7e7vhBMNzgAAAwdJREFUeNpt1PlX2koUB3CcsPgQ6RNpUVR8LNLIKkuJlCVRVEyCsoQliCAgiEJIohK4f/5LF0+l7fw2Zz7nznK+dzQrmuWB0PL8PcCMH4yr6x6L3qD9C0AG44a7cFV9GDl9GR/2JzDGsuTBGQB8poVKZH3NgJYAwsxfyk+zWHyWoSEXPkjKbSt6B1Z3E7jtyKeA1xt5HlpCYxlgXz3JG0CbVyDUSltRecCUZ5V1rzAB6FnN2E+g27RcAch3toTChP0NSPryfnYg3X9d+wHQv3vuV5geFY7GkudRdDfn/DjjqibcRYf2O9Bvp/tTBvf2eSFZBZCyJwy8JtrSSaVgQipAJncpEOsEO3CRYNV1RakVX16IzNOAgQimAoMTz2cE+bC74Huzx4ssK7bZ+6l8lmyx3ZxRBSYLN20L59SL1CAljiDDA4E8ZB84ojNQynakWdF+VG6LzSDfyh+m77PHo2OiQn1NDxtMs1qKfdKpgLif9FqJxjCdLioCBz0RQH68HlHVRsr3jwpMZ3SfrxdbjaYECzmltOuv0h2Ub8q0CHOHusUuvuPO3eT7xyDWu+fV0jUR/O/j8W2t+OVEhqxWs2K1hcvQZpos7FnxsLdd99fZWBRnpWtHgQ0YNCvYzjPMU9FGzhE4nQ6JqaCWlud05BVyBOdRK+jCk9GVuwMUtVAgxQBU8PPpc8FJ9Wsuyoapt4hx1fQpCMFLQY6EGlH8opSJvADLTBZJq/bbU+90xoGzGUU0IRaXslmOpIE/YIiKLKbWkAo0ZtIf6UGXLZF+kC4BFIqGAbkVaHBxy3eAaU3Omvzo3k5Mn0JjhVcW8VBB4dMTEdf/CAxmj+WrlX0SzpMt5TqVF0HwBHsc1DbeImcOl0C+FBnXCG56F5WKBF0HXuS2sTeAfYgDtNldCsRL2hU8TUty1ObY0v1KNVpNCXdOO61QiYzdRYRuofBZv9wXq469jXx9XuM7fE+Bh6J9Df3eemiTTPWepuPxsBz3mNCfzYswTGfe3/T6HJ/0GNIsg/cIaZY+gP8BnnbNfjJJIQoAAAAASUVORK5CYII=';

    // do not touch
    function distanceBetween(e,n){return Math.sqrt(Math.pow(n.x-e.x,2)+Math.pow(n.y-e.y,2))}function angleBetween(e,n){return Math.atan2(n.x-e.x,n.y-e.y)}function getFilledInPixels(e){(!e||1>e)&&(e=1);for(var n=ctx.getImageData(0,0,canvasWidth,canvasHeight),a=n.data,t=a.length,o=t/e,s=0,i=s=0;t>i;i+=e)0===parseInt(a[i])&&s++;return Math.round(s/o*100)}function getMouse(e,n){var a,t,o=0,s=0;if(void 0!==n.offsetParent)do o+=n.offsetLeft,s+=n.offsetTop;while(n=n.offsetParent);if(hasTouch()){var i=e.touches[0];a=i.pageX-o,t=i.pageY-s}else a=e.pageX-o,t=e.pageY-s;return{x:a,y:t}}function handlePercentage(e,n){e=e||0,e>n&&(scratchCanvas.className="canvas fadeout",setTimeout(function(){scratchCanvas.style.display="none"},1500))}function handleMouseDown(e){isDrawing=!0,lastPoint=getMouse(e,canvas)}function handleMouseMove(e){if(isDrawing){e.preventDefault();for(var n,a,t=getMouse(e,canvas),o=distanceBetween(lastPoint,t),s=angleBetween(lastPoint,t),i=0;o>i;i++)n=lastPoint.x+Math.sin(s)*i-25,a=lastPoint.y+Math.cos(s)*i-25,ctx.globalCompositeOperation="destination-out",ctx.drawImage(brush,n,a);lastPoint=t,handlePercentage(getFilledInPixels(32),scratched)}}function handleMouseUp(e){isDrawing=!1}function hasTouch(){return"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0}canvas.addEventListener("mousedown",handleMouseDown,!1),canvas.addEventListener("touchstart",handleMouseDown,!1),canvas.addEventListener("mousemove",handleMouseMove,!1),canvas.addEventListener("touchmove",handleMouseMove,!1),canvas.addEventListener("mouseup",handleMouseUp,!1),canvas.addEventListener("touchend",handleMouseUp,!1);

});
