var firstGroup = document.getElementById("firstGroup"),
    secondGroup = document.getElementById("secondGroup"),
    count = document.getElementById("timer");

var page = commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "TrainYourBrain",
    suffix: "html5-ae-du-en-default",
    domain: "wap.mozook.com",
    doubleConfirmation: true,   
    language: "english",
    pageId: "2342",
    onWillTransition: function(currentState, nextState){
        if (currentState.name == "default-state" && nextState.name == "double-confirmation") {

            firstGroup.style.display="none";
            secondGroup.style.display="block";

            var second = 23
            var countdown = setInterval(function(){

              second = second - 1;
              if(second < 10){

                count.innerHTML = '00:0'+second;

              }else{

                count.innerHTML = '00:'+second;

              }

              if(second == 0){
                clearInterval(countdown);
              }

            }, 1000);
   
        }
        return true;
    },
    path: "uae/mobi-one/apis/jsonp"
});

page.getReady(function(){
    

    var confirm = document.getElementById("subscribe-now"),
        erroMessage = document.getElementById("erroMessage");


      confirm.addEventListener('click', function(){
         erroMessage.classList.add('active');
         setTimeout(function() {
             erroMessage.classList.remove('active');
         }, 2500);
      }, false);


});


