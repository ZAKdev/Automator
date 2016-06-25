window.mraid-redirect-landing-page = ({language}:parameters)->    
    
    {navigate-to-url, get-extra-event-args}:mraid-landing-page = window.mraid-landing-page!

    {populate, record-event, get-state, set-state, switch-state}:redirect-landing-page = 
        window.redirect-landing-page {} <<< parameters <<< {get-extra-event-args, navigate-to-url}    

    {
        get-ready: (callback) -> 
            <- mraid-landing-page.get-ready do 
                {
                    record-event
                    state-change-listener: parameters?.on-mraid-state-change
                }
            populate ...
            callback ... if !!callback
        record-event
        get-state
        set-state
        switch-state
        change-language: (iso-code) ->
            mraid-landing-page.change-language iso-code
            redirect-landing-page.change-language iso-code
    }