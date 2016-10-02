// Timer
var seconds = 30,
    timeLeft = document.getElementById("time-left");

if(timeLeft != undefined){
    setInterval(function(){
        if(seconds != 0){
            seconds = seconds - 1;
            if(seconds < 10){
                document.getElementById("time-left").innerHTML = "00:0"+seconds
            } else {
                document.getElementById("time-left").innerHTML = "00:"+seconds
            }
        }
    }, 1000)
}

// Start Switching Pages
    var page = ['switchState'];
    var pageStates = [
           "default-state",
           "double-confirmation",
           "subscription-polling",
           "number-entry",
           "pin-entry",
           "mo",
           "congrats",
           "operator-selection"
        ];
    var switchState = function(state){
        pageStates.map(function(page){
            document.getElementById('container').className = 'show-'+state;
            if(page != state){
                document.getElementById(page).style.display = "none";
            } else {
                document.getElementById(state).style.display = "block";
            }
        });
    }

    page.switchState = switchState;
// End Switching Pages

// Start Code for taking screenshots, enabling divs through URLS
    var state = location.search.split('?state=')[1];
    if(state){
        pageStates.map(function(page){
            document.getElementById('container').className = 'show-'+state;
            if(page != state){
                document.getElementById(page).style.display = "none";
            } else {
                document.getElementById(state).style.display = "block";
            }
        });
    }
// End Code for taking screenshots, enabling divs through URLS