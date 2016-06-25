# require mraid-landing-page
# require iframe-landing-page

window.mraid-iframe-landing-page = (parameters)->

    {get-extra-event-args}:mraid-landing-page = window.mraid-landing-page parameters
    {change-language, populate, record-event, mount-page} = 
        window.html5-iframe-landing-page {} <<< parameters <<< {
            get-extra-event-args: -> 
                e = do ->
                    if !!parameters?.get-extra-event-args 
                        parameters.get-extra-event-args!
                    else
                        {}
                {} <<< get-extra-event-args! <<< e
        }

    {
        change-language
        get-ready: (callback) -> 
            <- mraid-landing-page.get-ready do 
                {
                    record-event
                    state-change-listener: parameters?.on-mraid-state-change
                }
            populate ...
            mount-page!
            callback ... if !!callback

        get-ready-without-mount: (callback) -> 
            <- mraid-landing-page.get-ready do 
                {
                    record-event
                    state-change-listener: parameters?.on-mraid-state-change
                }
            populate ...
            callback ... if !!callback

        record-event
        populate
        mount-page
    }   